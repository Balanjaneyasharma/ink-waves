import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
  statusCode = 200,
  data: T ,
) => {
  return res.status(statusCode).json({
    success: true,
    data: data
  });
};

export const errorResponse = (
  res: Response,
  statusCode = 500,
  message: string = 'An error occurred',
  error?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    // only expose stack/error details in development
    ...(process.env.NODE_ENV === 'development' && { error }),
  });
};
