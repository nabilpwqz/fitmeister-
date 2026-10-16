import { Request, Response, NextFunction } from 'express';
import { BookingsService } from './bookings.service';
import { createBookingSchema, cancelBookingSchema } from './bookings.schemas';

export class BookingsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBookingSchema.parse(req.body);
      const booking = await BookingsService.createBooking(req.user!.id, data);
      return res.status(201).json({
        success: true,
        message: 'Reservation confirmed successfully',
        data: { booking },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await BookingsService.getUserBookings(req.user!.id);
      return res.status(200).json({
        success: true,
        data: { bookings },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingsService.getBookingById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return res.status(200).json({
        success: true,
        data: { booking },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      cancelBookingSchema.parse(req.body || {});
      const booking = await BookingsService.cancelBooking(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return res.status(200).json({
        success: true,
        message: 'Reservation cancelled successfully',
        data: { booking },
      });
    } catch (err) {
      return next(err);
    }
  }
}
