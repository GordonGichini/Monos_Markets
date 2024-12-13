import { Request, Response, NextFunction } from 'express';
import { Payment } from '../models/payment';
import db from '../config/db';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { StripeService } from '../services/stripeService';

const stripeService = new StripeService();

export const createPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { subscriptionId, amount } = req.body;
    const userId = req.user?.id;

    // Verify that the subscription belongs to the user
    const subscription = await db.oneOrNone(
      'SELECT s.* FROM subscriptions s JOIN businesses b ON s.business_id = b.id WHERE s.id = $1 AND b.user_id = $2',
      [subscriptionId, userId]
    );

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (amount !== subscription.price) {
      throw new AppError('Invalid payment amount', 400);
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripeService.createPaymentIntent(amount);

    // Create payment record
    const newPayment = await db.one(
      'INSERT INTO payments (subscription_id, amount, stripe_payment_intent_id, payment_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [subscriptionId, amount, paymentIntent.id, new Date()]
    );

    logger.info(`Payment created: ${newPayment.id}`);
    res.status(201).json(newPayment);
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const payment = await db.oneOrNone(
      'SELECT p.* FROM payments p JOIN subscriptions s ON p.subscription_id = s.id JOIN businesses b ON s.business_id = b.id WHERE p.id = $1 AND b.user_id = $2',
      [id, userId]
    );

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
};

