export enum SubscriptionTier {
    STARTER = 'starter',
    PRO = 'pro',
    ENTERPRISE = 'enterprise'
}

export interface Subscription {
    id: string;
    businessId: string;
    tier: SubscriptionTier;
    price: number;
    productCount: number;
    branchCount: number;
    startDate: Date;
    endDate: Date;
}