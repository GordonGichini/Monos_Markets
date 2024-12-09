import { Subscription, SubscriptionTier } from '../models/subscription';
import { Payment } from '../models/payment';
import { AppError } from '../utils/appError';

export class PaymentService {
  private subscriptions: Subscription[] = [];
  private payments: Payment[] = [];

  async createSubscription(businessId: string, tier: SubscriptionTier, productCount: number, branchCount: number): Promise<Subscription> {
    const price = this.calculatePrice(tier, branchCount);
    const subscription: Subscription = {
      id: Date.now().toString(),
      businessId,
      tier,
      price,
      productCount,
      branchCount,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  async updateSubscription(id: string, tier: SubscriptionTier, productCount: number, branchCount: number): Promise<Subscription> {
    const subscription = this.subscriptions.find(sub => sub.id === id);
    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }
    subscription.tier = tier;
    subscription.productCount = productCount;
    subscription.branchCount = branchCount;
    subscription.price = this.calculatePrice(tier, branchCount);
    return subscription;
  }

  async processPayment(subscriptionId: string, amount: number): Promise<Payment> {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId);
    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }
    if (amount !== subscription.price) {
      throw new AppError('Invalid payment amount', 400);
    }
    const payment: Payment = {
      id: Date.now().toString(),
      subscriptionId,
      amount,
      date: new Date(),
    };
    this.payments.push(payment);
    return payment;
  }

  private calculatePrice(tier: SubscriptionTier, branchCount: number): number {
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
}

