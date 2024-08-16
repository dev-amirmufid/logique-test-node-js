import { Router } from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/book.controller';
import { rateLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../middlewares/validateRequest';
import { bookSchema } from '../middlewares/validationSchemas';

const router = Router();

// Middleware rate limiting
router.use(rateLimiter);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with search and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for title, author, or genres
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalBooks:
 *                   type: integer
 *                   example: 50
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       publishedYear:
 *                         type: number
 *                       genres:
 *                         type: array
 *                         items:
 *                           type: string
 *                       stock:
 *                         type: number
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get('/books', getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 publishedYear:
 *                   type: number
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: string
 *                 stock:
 *                   type: number
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/books/:id', getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/books', validateRequest(bookSchema), createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.put('/books/:id', validateRequest(bookSchema), updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/books/:id', deleteBook);

export default router;
