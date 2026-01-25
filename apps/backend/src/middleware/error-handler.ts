import type { ApiError } from '@tic-tac-toe-web-game/types';
import type { Request, Response, NextFunction } from 'express';


export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // If headers have already been sent, delegate to Express default error handler https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }

  console.error('Error:', err);

  // If it's already an ApiError, use it
  if ('statusCode' in err && 'error' in err && 'message' in err) {
    res.status(err.statusCode).json({
      error: {
        error: err.error,
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: {
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
      statusCode: 500,
    },
  });
}
