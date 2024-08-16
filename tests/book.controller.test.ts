import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '../src/prisma-client';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const prisma = new PrismaClient();

// Mocking Prisma Client
jest.mock('../src/prisma-client', () => {
  const mockPrisma = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    genre: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mocking Winston Logger
jest.mock('../src/middlewares/logger', () => {
  const originalModule = jest.requireActual('../src/middlewares/logger');
  return {
    ...originalModule,
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('Book API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('should return paginated books with search', async () => {
      const books = [
        {
          id: uuidv4(),
          title: 'Test Book 1',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 10,
        },
        {
          id: uuidv4(),
          title: 'Test Book 2',
          author: 'Jane Doe',
          publishedYear: 2021,
          genres: ['Non-Fiction'],
          stock: 5,
        },
      ];

      const genres = [
        {
          id: uuidv4(),
          name: 'Fiction',
        },
        {
          id: uuidv4(),
          name: 'Non-Fiction',
        },
      ];
      (prisma.book.findMany as jest.Mock).mockResolvedValue(books);
      (prisma.genre.findMany as jest.Mock).mockResolvedValue(genres);
      (prisma.book.count as jest.Mock).mockResolvedValue(50);

      const res = await request(app).get(
        '/api/books?search=Book&page=1&limit=2',
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.page).toBe(1);
      expect(res.body.totalPages).toBe(25);
      expect(res.body.totalBooks).toBe(50);
      expect(res.body.books.length).toEqual(books.length);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return a book by ID', async () => {
      const book = {
        id: uuidv4(),
        title: 'Test Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 10,
      };
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(book);

      const res = await request(app).get(`/api/books/${book.id}`);

      expect(res.statusCode).toBe(200);
    });

    it('should return 404 if book not found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/books/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const newBook = {
        id: uuidv4(),
        title: 'New Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 10,
      };
      const genres = [
        {
          id: uuidv4(),
          name: 'Fiction',
        },
        {
          id: uuidv4(),
          name: 'Non-Fiction',
        },
      ];
      (prisma.genre.findMany as jest.Mock).mockResolvedValue(genres);
      (prisma.book.create as jest.Mock).mockResolvedValue(newBook);

      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'New Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 10,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newBook);
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 10,
        }); // Missing title

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('"title" is required');
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update an existing book', async () => {
      const updatedBook = {
        id: uuidv4(),
        title: 'Updated Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 5,
      };
      const genres = [
        {
          id: uuidv4(),
          name: 'Fiction',
        },
        {
          id: uuidv4(),
          name: 'Non-Fiction',
        },
      ];
      (prisma.genre.findMany as jest.Mock).mockResolvedValue(genres);
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(updatedBook);
      (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

      const res = await request(app)
        .put(`/api/books/${updatedBook.id}`)
        .send({
          title: 'Updated Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 5,
        });

      expect(res.statusCode).toBe(200);
    });

    it('should return 404 if book not found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.book.update as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .put('/api/books/999')
        .send({
          title: 'Updated Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 5,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete an existing book', async () => {
      const deletedBook = {
        id: uuidv4(),
        title: 'Deleted Book',
        author: 'John Doe',
        publishedYear: 2020,
        genreId: uuidv4(),
        stock: 0,
      };
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(deletedBook);
      (prisma.book.delete as jest.Mock).mockResolvedValue(deletedBook);

      const res = await request(app).delete(`/api/books/${deletedBook.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Book deleted successfully' });
      expect(prisma.book.delete).toHaveBeenCalledWith({
        where: { id: deletedBook.id },
      });
    });

    it('should return 404 if book not found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.book.delete as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/api/books/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });
});
