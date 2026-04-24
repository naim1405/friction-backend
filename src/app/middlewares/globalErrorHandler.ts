import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';
import handleClientError from '../../errors/handleClientError';
import handleZodError from '../../errors/handleZodError';
import { Prisma } from '../../generated/prisma/client';
import { ZodError } from 'zod';
import type { IApiErrorMessage } from '../../interface';
import logger from '../../helpers/logger';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;

  const isProduction = config.env === 'production';

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IApiErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    message = 'An unexpected database error occurred';
    errorMessages = [{ path: '', message }];
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = 'Database connection failed';
    errorMessages = [{ path: '', message }];
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  } else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
    errorMessages = [{ path: '', message }];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }

  const errorStack = error instanceof Error ? error.stack : undefined;

  const logContext = {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    errorMessages,
    stack: errorStack,
  };

  if (statusCode >= 500) {
    logger.error('Request failed', logContext);
  } else {
    logger.warn('Request returned handled error', logContext);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: !isProduction ? errorStack : undefined,
  });
};

export default globalErrorHandler;
