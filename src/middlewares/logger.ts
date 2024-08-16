import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Middleware untuk logging request
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

// Middleware untuk logging error
export const logError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  next(err);
};
