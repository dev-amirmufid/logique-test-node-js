import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const createBook = async (req, res) => {
    const { title, author, publishedYear, genres, stock } = req.body;
    const newBook = await prisma.book.create({
        data: {
            title,
            author,
            publishedYear,
            genres,
            stock,
        },
    });
    res.status(201).json(newBook);
};
export const getAllBooks = async (req, res) => {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
};
export const getBookById = async (req, res) => {
    const book = await prisma.book.findUnique({
        where: { id: req.params.id },
    });
    if (!book) {
        res.status(404).json({ message: 'Book not found' });
    }
    else {
        res.status(200).json(book);
    }
};
export const updateBook = async (req, res) => {
    const { title, author, publishedYear, genres, stock } = req.body;
    const updatedBook = await prisma.book.update({
        where: { id: req.params.id },
        data: {
            title,
            author,
            publishedYear,
            genres,
            stock,
        },
    });
    res.status(200).json(updatedBook);
};
export const deleteBook = async (req, res) => {
    await prisma.book.delete({
        where: { id: req.params.id },
    });
    res.status(200).json({ message: 'Book deleted successfully' });
};
