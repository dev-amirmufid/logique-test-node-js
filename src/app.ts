import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import bookRoutes from './routes/book.route';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger';
import { logRequest, logError } from './middlewares/logger';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Middleware logging request
app.use(logRequest);

app.use('/api', bookRoutes);

setupSwagger(app);

// Handle 404 errors
app.use(notFoundHandler);

// Middleware logging error
app.use(logError);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;
