import { Request, Response, NextFunction } from 'express';
import { Subscription, SubscriptionTier } from '../models/subscription';
import db from '../config/db';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export const createSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { businessId, tier, productCount } = req.body;
    const userId = req.user?.id;

    // Verify that the business belongs to the user
    const business = await db.oneOrNone('SELECT * FROM businesses WHERE id = $1 AND user_id = $2', [businessId, userId]);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const price = calculatePrice(tier as SubscriptionTier, business.branch_count);

    const newSubscription = await db.one(
      'INSERT INTO subscriptions (business_id, tier, price, product_count, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [businessId, tier, price, productCount, new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );

    logger.info(`Subscription created: ${newSubscription.id}`);
    res.status(201).json(newSubscription);
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const subscription = await db.oneOrNone(
      'SELECT s.* FROM subscriptions s JOIN businesses b ON s.business_id = b.id WHERE s.id = $1 AND b.user_id = $2',
      [id, userId]
    );

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tier, productCount } = req.body;
    const userId = req.user?.id;

    const subscription = await db.oneOrNone(
      'SELECT s.*, b.branch_count FROM subscriptions s JOIN businesses b ON s.business_id = b.id WHERE s.id = $1 AND b.user_id = $2',
      [id, userId]
    );

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    const price = calculatePrice(tier as SubscriptionTier, subscription.branch_count);

    const updatedSubscription = await db.oneOrNone(
      'UPDATE subscriptions SET tier = $1, price = $2, product_count = $3 WHERE id = $4 RETURNING *',
      [tier, price, productCount, id]
    );

    logger.info(`Subscription updated: ${updatedSubscription.id}`);
    res.json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await db.result(
      'DELETE FROM subscriptions WHERE id = $1 AND business_id IN (SELECT id FROM businesses WHERE user_id = $2)',
      [id, userId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Subscription not found', 404);
    }

    logger.info(`Subscription deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

function calculatePrice(tier: SubscriptionTier, branchCount: number): number {
  let basePrice: number;
  switch (tier) {
    case SubscriptionTier.STARTER:
      basePrice = 1;
      break;
    case SubscriptionTier.PRO:
      basePrice = 3;
      break;
    case SubscriptionTier.ENTERPRISE:
      basePrice = 5;
      break;
    default:
      throw new AppError('Invalid subscription tier', 400);
  }
  return basePrice + (branchCount - 1);
}

