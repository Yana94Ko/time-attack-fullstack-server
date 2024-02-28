import { NextFunction, Request, Response } from 'express';

export default function authGuard(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (!req.user) throw new Error('Unauthorized');
  next();
}
