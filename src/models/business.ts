import { User } from './user';
import { Subscription } from './subscription';

export interface Business {
  id: number;
  userId: number;
  name: string;
  description: string;
  branchCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  subscriptions?: Subscription[];
}

