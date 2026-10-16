import { Request, Response, NextFunction } from 'express';
import { RoomsService } from './rooms.service';
import { createRoomSchema, updateRoomSchema, roomQuerySchema } from './rooms.schemas';

export class RoomsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = roomQuerySchema.parse(req.query);
      const amenities = Array.isArray(query.amenity)
        ? query.amenity
        : query.amenity
        ? [query.amenity]
        : undefined;

      const result = await RoomsService.getAll({
        search: query.search,
        city: query.city,
        minCapacity: query.minCapacity,
        maxRate: query.maxRate,
        amenities,
        sortBy: query.sortBy,
        page: query.page,
        limit: query.limit,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomsService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: { room },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRoomSchema.parse(req.body);
      const room = await RoomsService.create(req.user!.id, data);
      return res.status(201).json({
        success: true,
        message: 'Room listing published successfully',
        data: { room },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateRoomSchema.parse(req.body);
      const room = await RoomsService.update(req.params.id, req.user!.id, req.user!.role, data);
      return res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: { room },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RoomsService.delete(req.params.id, req.user!.id, req.user!.role);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      return next(err);
    }
  }
}
