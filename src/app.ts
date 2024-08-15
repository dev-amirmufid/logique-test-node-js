import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import bookRoutes from './routes/book.route';
import { setupSwagger } from './swagger';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api', bookRoutes);

// app.use(
//   (
//     err: unknown,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction,
//   ) => {
//     res.status(500).json({ message: 'An unexpected error occurred' });
//   },
// );

setupSwagger(app);
export default app;
