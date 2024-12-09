import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { SubscriptionTier } from '../models/subscription';

export const validateSubscription = (req: Request, res: Response, next: NextFunction) => {
  const { tier, productCount, branchCount } = req.body;

  if (!tier || !Object.values(SubscriptionTier).includes(tier)) {
    return next(new AppError('Invalid subscription tier', 400));
  }

  if (typeof productCount !== 'number' || productCount < 0) {
    return next(new AppError('Invalid product count', 400));
  }

  if (typeof branchCount !== 'number' || branchCount < 1) {
    return next(new AppError('Invalid branch count', 400));
  }

  next();
};

export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  const { subscriptionId, amount } = req.body;

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    return next(new AppError('Invalid subscription ID', 400));
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return next(new AppError('Invalid payment amount', 400));
  }

  next();
};

