import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';
import { z } from 'zod';

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters').max(1000),
});

export class ReviewsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createReviewSchema.parse(req.body);
      const review = await ReviewsService.createReview(req.user!.id, data);
      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: { review },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getByRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewsService.getRoomReviews(req.params.roomId);
      return res.status(200).json({
        success: true,
        data: { reviews },
      });
    } catch (err) {
      return next(err);
    }
  }
}
