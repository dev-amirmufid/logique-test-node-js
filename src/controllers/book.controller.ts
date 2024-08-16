import { Request, Response, NextFunction } from 'express';
import BookService from '../services/book.service';

const bookService = new BookService();

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, author, publishedYear, genres, stock } = req.body;

    const newBook = await bookService.createBook({
      title,
      author,
      publishedYear,
      genres,
      stock,
    });

    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const books = await bookService.getAllBooks({
      search: search as string | undefined,
      pageNumber,
      pageSize,
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, author, publishedYear, genres, stock } = req.body;
    const updatedBook = await bookService.updateBook(req.params.id, {
      title,
      author,
      publishedYear,
      genres,
      stock,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await bookService.deleteBook(req.params.id);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};
