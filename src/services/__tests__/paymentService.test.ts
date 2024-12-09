import { PaymentService } from '../paymentServices';
import { SubscriptionTier } from '../../models/subscription';
import { AppError } from '../../utils/appError';
import db from '../../config/db';

jest.mock('../../config/db');

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('createSubscription', () => {
    it('should create a subscription successfully', async () => {
      const mockDbResult = {
        id: '1',
        business_id: 'business1',
        tier: SubscriptionTier.STARTER,
        price: 1,
        product_count: 5,
        branch_count: 1,
        start_date: new Date(),
        end_date: new Date(),
      };

      (db.one as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await paymentService.createSubscription('business1', SubscriptionTier.STARTER, 5, 1);

      expect(result).toEqual({
        id: '1',
        businessId: 'business1',
        tier: SubscriptionTier.STARTER,
        price: 1,
        productCount: 5,
        branchCount: 1,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
    });
  });

  describe('updateSubscription', () => {
    it('should update a subscription successfully', async () => {
      const mockDbResult = {
        id: '1',
        business_id: 'business1',
        tier: SubscriptionTier.PRO,
        price: 4,
        product_count: 15,
        branch_count: 2,
        start_date: new Date(),
        end_date: new Date(),
      };

      (db.oneOrNone as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await paymentService.updateSubscription('1', SubscriptionTier.PRO, 15, 2);

      expect(result).toEqual({
        id: '1',
        businessId: 'business1',
        tier: SubscriptionTier.PRO,
        price: 4,
        productCount: 15,
        branchCount: 2,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
    });

    it('should throw an error if subscription is not found', async () => {
      (db.oneOrNone as jest.Mock).mockResolvedValue(null);

      await expect(paymentService.updateSubscription('1', SubscriptionTier.PRO, 15, 2))
        .rejects.toThrow(new AppError('Subscription not found', 404));
    });
  });
});

