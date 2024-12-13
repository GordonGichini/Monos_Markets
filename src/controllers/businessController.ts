import { Request, Response, NextFunction } from 'express';
import { Business } from '../models/business';
import db from '../config/db';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export const createBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, branchCount } = req.body;
    const userId = req.user?.id;

    const newBusiness = await db.one(
      'INSERT INTO businesses (user_id, name, description, branch_count) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, description, branchCount]
    );

    logger.info(`Business created: ${newBusiness.id}`);
    res.status(201).json(newBusiness);
  } catch (error) {
    next(error);
  }
};

export const getBusinesses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const businesses = await db.any('SELECT * FROM businesses WHERE user_id = $1', [userId]);

    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

export const getBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const business = await db.oneOrNone('SELECT * FROM businesses WHERE id = $1 AND user_id = $2', [id, userId]);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    res.json(business);
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, branchCount } = req.body;
    const userId = req.user?.id;

    const updatedBusiness = await db.oneOrNone(
      'UPDATE businesses SET name = $1, description = $2, branch_count = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, description, branchCount, id, userId]
    );

    if (!updatedBusiness) {
      throw new AppError('Business not found', 404);
    }

    logger.info(`Business updated: ${updatedBusiness.id}`);
    res.json(updatedBusiness);
  } catch (error) {
    next(error);
  }
};

export const deleteBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await db.result('DELETE FROM businesses WHERE id = $1 AND user_id = $2', [id, userId]);

    if (result.rowCount === 0) {
      throw new AppError('Business not found', 404);
    }

    logger.info(`Business deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

