import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export class StripeService {
  async createPaymentIntent(amount: number, currency: string = 'gbp'): Promise<string> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: currency,
    });

    return paymentIntent.client_secret as string;
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  }
}

