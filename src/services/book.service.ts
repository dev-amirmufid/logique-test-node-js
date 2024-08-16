import { Prisma, PrismaClient } from '../prisma-client';
import { NotFoundError } from '../middlewares/exceptions';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

interface getAllBooksInterface {
  search?: string;
  pageNumber: number;
  pageSize: number;
}

interface createBookInterface
  extends Omit<Prisma.BookCreateInput, 'id' | 'genres'> {
  genres: string[];
}
interface updateBookInterface extends Omit<Prisma.BookCreateInput, 'genres'> {
  genres: string[];
}

class BookService {
  async getAllBooks(query: getAllBooksInterface) {
    const { pageNumber, pageSize } = query;
    const searchCondition: Prisma.BookWhereInput = {
      AND: [],
    };

    if (query?.search && Array.isArray(searchCondition.AND)) {
      searchCondition.AND.push({
        OR: [
          {
            title: {
              contains: query?.search,
            },
          },
          {
            author: {
              contains: query?.search,
            },
          },
          {
            genres: {
              some: {
                name: {
                  contains: query?.search,
                },
              },
            },
          },
        ],
      });
    }

    const totalBooks = await prisma.book.count({
      where: searchCondition,
    });

    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        publishedYear: true,
        stock: true,
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: searchCondition,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalBooks / pageSize);

    return {
      page: pageNumber,
      totalPages,
      totalBooks,
      books: books.map((item) => ({
        ...item,
        genres: item.genres.map((genre) => genre.name),
      })),
    };
  }

  async getBookById(id: string) {
    const book = await prisma.book.findUnique({
      select: {
        id: true,
        title: true,
        author: true,
        publishedYear: true,
        stock: true,
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return { ...book, genres: book.genres.map((genre) => genre.name) };
  }

  async createBook(data: createBookInterface) {
    const dataGenres = await prisma.genre.findMany({
      where: {
        name: {
          in: data.genres,
        },
      },
    });

    const newGenres = data.genres
      .filter((genre) => !dataGenres.some((dg) => dg.name === genre))
      .map((genre) => ({
        name: genre,
        id: uuid(),
      }));

    const genres = [...dataGenres, ...newGenres];

    const createdBook = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        publishedYear: data.publishedYear,
        stock: data.stock,
        genres: {
          connectOrCreate: genres.map((i) => ({
            where: { id: i.id },
            create: { name: i.name },
          })),
        },
      },
    });

    return createdBook;
  }

  async updateBook(id: string, data: updateBookInterface) {
    const book = await prisma.book.findUnique({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    const existingGenres = await prisma.genre.findMany({
      where: {
        name: {
          in: data.genres,
        },
      },
    });

    const newGenres = data.genres
      .filter((genre) => !existingGenres.some((eg) => eg.name === genre))
      .map((genre) => ({
        name: genre,
        id: uuid(),
      }));

    const allGenres = [...existingGenres, ...newGenres];

    const updatedBook = await prisma.book.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        author: data.author,
        publishedYear: data.publishedYear,
        stock: data.stock,
        genres: {
          set: [],
          connectOrCreate: allGenres.map((genre) => ({
            where: { id: genre.id },
            create: { name: genre.name },
          })),
        },
      },
      include: {
        genres: true,
      },
    });

    return {
      ...updatedBook,
      genres: updatedBook.genres.map((genre) => genre.name),
    };
  }

  async deleteBook(id: string) {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return await prisma.book.delete({
      where: {
        id,
      },
    });
  }
}

export default BookService;
