import { Request, Response, NextFunction } from 'express';
import { AvailabilityService } from './availability.service';
import { BadRequestError } from '../../middleware/errorHandler';

export class AvailabilityController {
  static async getRoomAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const { date } = req.query;

      if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new BadRequestError('Query param `date` must be formatted as YYYY-MM-DD');
      }

      const result = await AvailabilityService.getRoomAvailabilityForDate(roomId, date);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}
