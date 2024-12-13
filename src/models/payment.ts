export interface Payment {
    id: number;
    subscriptionId: number;
    amount: number;
    stripePaymentIntentId: string;
    paymentDate: Date;
    paymentStatus: String;
  }
  
  