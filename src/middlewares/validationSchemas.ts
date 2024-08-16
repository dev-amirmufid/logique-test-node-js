import Joi from 'joi';

export const bookSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
  }),
  author: Joi.string().required().messages({
    'string.empty': 'Author is required',
  }),
  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(9999)
    .required()
    .messages({
      'number.base': 'Published year must be a valid number',
      'number.min': 'Published year must be at least 1000',
      'number.max': 'Published year must be at most 9999',
    }),
  genres: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Genres must be an array of strings',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock must be a valid number',
    'number.min': 'Stock must be a positive integer',
  }),
});
