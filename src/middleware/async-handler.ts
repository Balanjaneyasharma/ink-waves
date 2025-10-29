
// type AsyncRequestHandler<T = any> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

// export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../shared/interfaces/request-with-user';

export const asyncHandler = (
  fn: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<any> // <-- changed void → any
) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
