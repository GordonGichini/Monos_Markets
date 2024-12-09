import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/paymentRoutes';
import { errorHandler } from './middleware/errorHandler';
import db from './config/db';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection test
db.connect()
  .then(() => {
    logger.info('Connected to the database successfully');
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  });
  
export default app;

