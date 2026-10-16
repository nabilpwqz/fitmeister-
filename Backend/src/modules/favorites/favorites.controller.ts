import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export class FavoritesController {
  static async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const userId = req.user!.id;

      const existing = await prisma.favorite.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      if (existing) {
        await prisma.favorite.delete({
          where: { id: existing.id },
        });
        return res.status(200).json({
          success: true,
          message: 'Room removed from favorites',
          data: { isFavorited: false },
        });
      } else {
        await prisma.favorite.create({
          data: { userId, roomId },
        });
        return res.status(200).json({
          success: true,
          message: 'Room saved to favorites',
          data: { isFavorited: true },
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  static async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user!.id },
        include: {
          room: {
            include: { images: { take: 1 } },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: { favorites: favorites.map(f => f.room) },
      });
    } catch (err) {
      return next(err);
    }
  }
}
