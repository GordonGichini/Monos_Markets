import express from 'express';
import { createSubscription, updateSubscription, processPayment } from '../controllers/paymentController';
import { validateSubscription, validatePayment } from '../middleware/validation';

const router = express.Router();

router.post('/create-subscription', validateSubscription, createSubscription);
router.put('/update-subscription/:id', validateSubscription, updateSubscription);
router.post('/process-payment', validatePayment, processPayment);

export default router;

