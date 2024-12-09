import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    businessId: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('No token provided', 401));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(new AppError('Invalid token format', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; businessId: string };
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

