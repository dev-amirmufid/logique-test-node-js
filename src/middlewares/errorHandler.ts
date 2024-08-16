import { Request, Response, NextFunction } from 'express';
import { AppError, NotFoundError } from './exceptions';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  logger.error('Server Error', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    statusCode: 500,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new NotFoundError('URL not found');
  next(error);
};
