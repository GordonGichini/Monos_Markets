import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentServices';
import { SubscriptionTier } from '../models/subscription';

const paymentService = new PaymentService();

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessId, tier, productCount, branchCount } = req.body;
    const subscription = await paymentService.createSubscription(businessId, tier as SubscriptionTier, productCount, branchCount);
    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tier, productCount, branchCount } = req.body;
    const updatedSubscription = await paymentService.updateSubscription(id, tier as SubscriptionTier, productCount, branchCount);
    res.json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subscriptionId, amount } = req.body;
    const payment = await paymentService.processPayment(subscriptionId, amount);
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

