import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const timestamp = new Date().toISOString();

  // Log with timestamp and request details for better Linux log scanning
  console.error(`[${timestamp}] [ERROR] ${req.method} ${req.path}: ${err.message}`);

  // Optional: Add stack trace in dev for deep debugging
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Hide details from the client in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};