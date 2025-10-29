// shared/helpers/async-handler.util.ts
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../interfaces/request-with-user';

export const asyncHandler = (
  fn: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<any> // <-- changed void → any
) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
