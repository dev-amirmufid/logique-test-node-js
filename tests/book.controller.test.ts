import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mocking Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Book API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      const books = [
        {
          id: '1',
          title: 'Test Book 1',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 10,
        },
        {
          id: '2',
          title: 'Test Book 2',
          author: 'Jane Doe',
          publishedYear: 2021,
          genres: ['Non-Fiction'],
          stock: 5,
        },
      ];
      (prisma.book.findMany as jest.Mock).mockResolvedValue(books);

      const res = await request(app).get('/api/books');

      console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(books);
      expect(prisma.book.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return a book by ID', async () => {
      const book = {
        id: '1',
        title: 'Test Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 10,
      };
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(book);

      const res = await request(app).get('/api/books/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(book);
      expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
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
        id: '1',
        title: 'New Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 10,
      };
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
      expect(prisma.book.create).toHaveBeenCalledWith({
        data: {
          title: 'New Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 10,
        },
      });
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
        id: '1',
        title: 'Updated Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 5,
      };
      (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

      const res = await request(app)
        .put('/api/books/1')
        .send({
          title: 'Updated Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 5,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedBook);
      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated Book',
          author: 'John Doe',
          publishedYear: 2020,
          genres: ['Fiction'],
          stock: 5,
        },
      });
    });

    it('should return 404 if book not found', async () => {
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
        id: '1',
        title: 'Deleted Book',
        author: 'John Doe',
        publishedYear: 2020,
        genres: ['Fiction'],
        stock: 0,
      };
      (prisma.book.delete as jest.Mock).mockResolvedValue(deletedBook);

      const res = await request(app).delete('/api/books/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Book deleted successfully' });
      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return 404 if book not found', async () => {
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
