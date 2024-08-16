import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '../middlewares/exceptions'; // Pastikan Anda sudah membuat custom exception untuk validation error

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      // Lempar custom ValidationError dengan pesan gabungan
      return next(new ValidationError(messages));
    }

    next();
  };
};
