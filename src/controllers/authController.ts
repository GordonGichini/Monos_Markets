import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user';
import db from '../config/db';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Check if user already exists
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      throw new AppError('Invalid user role', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await db.one(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hashedPassword, fullName, role]
    );

    logger.info(`User registered: ${newUser.id}`);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    logger.info(`User logged in: ${user.id}`);
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role } });
  } catch (error) {
    next(error);
  }
};

