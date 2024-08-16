import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batasi 100 request per IP
  message: 'Too many requests from this IP, please try again later.',
});
