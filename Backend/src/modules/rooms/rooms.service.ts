import { prisma } from '../../prisma/client';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export class RoomsService {
  static async getAll(params: {
    search?: string;
    city?: string;
    minCapacity?: number;
    maxRate?: number;
    amenities?: string[];
    sortBy?: 'price_asc' | 'price_desc' | 'capacity_asc' | 'capacity_desc' | 'newest';
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      isApproved: true,
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { city: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.city) {
      where.city = { contains: params.city, mode: 'insensitive' };
    }

    if (params.minCapacity) {
      where.capacity = { gte: params.minCapacity };
    }

    if (params.maxRate) {
      where.hourlyRate = { lte: params.maxRate };
    }

    if (params.amenities && params.amenities.length > 0) {
      where.amenities = {
        hasEvery: params.amenities,
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (params.sortBy === 'price_asc') orderBy = { hourlyRate: 'asc' };
    if (params.sortBy === 'price_desc') orderBy = { hourlyRate: 'desc' };
    if (params.sortBy === 'capacity_asc') orderBy = { capacity: 'asc' };
    if (params.sortBy === 'capacity_desc') orderBy = { capacity: 'desc' };

    const [total, rooms] = await Promise.all([
      prisma.room.count({ where }),
      prisma.room.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 3,
          },
          owner: {
            select: { id: true, name: true, avatarUrl: true },
          },
          _count: {
            select: { bookings: true, reviews: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
    ]);

    const formattedRooms = rooms.map(room => {
      const avgRating =
        room.reviews.length > 0
          ? Number((room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1))
          : 0;
      const { reviews, ...rest } = room;
      return {
        ...rest,
        averageRating: avgRating,
        reviewCount: room._count.reviews,
        bookingsCount: room._count.bookings,
      };
    });

    return {
      rooms: formattedRooms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        operatingHours: { orderBy: { dayOfWeek: 'asc' } },
        availabilityBlocks: {
          where: { endTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
        },
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
    });

    if (!room) {
      throw new NotFoundError(`Room with id '${id}' not found`);
    }

    const avgRating =
      room.reviews.length > 0
        ? Number((room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1))
        : 0;

    return {
      ...room,
      averageRating: avgRating,
      reviewCount: room._count.reviews,
      bookingsCount: room._count.bookings,
    };
  }

  static async create(
    userId: string,
    data: {
      name: string;
      description: string;
      floor: string;
      capacity: number;
      hourlyRate: number;
      city?: string;
      address?: string;
      amenities?: string[];
      images?: string[];
      minDurationHours?: number;
      maxDurationHours?: number;
      bufferMinutes?: number;
    }
  ) {
    const { images = [], ...roomData } = data;

    const defaultOperatingHours = [0, 1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      openTime: '08:00',
      closeTime: '22:00',
      isOpen: true,
    }));

    const room = await prisma.room.create({
      data: {
        ...roomData,
        ownerId: userId,
        images: {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
        operatingHours: {
          create: defaultOperatingHours,
        },
      },
      include: {
        images: true,
        operatingHours: true,
      },
    });

    return room;
  }

  static async update(
    roomId: string,
    userId: string,
    userRole: string,
    data: any
  ) {
    const existing = await prisma.room.findUnique({ where: { id: roomId } });
    if (!existing) {
      throw new NotFoundError('Room not found');
    }

    if (existing.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only modify listings you own');
    }

    const { images, ...fields } = data;

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: fields,
      include: {
        images: true,
        operatingHours: true,
      },
    });

    return updated;
  }

  static async delete(roomId: string, userId: string, userRole: string) {
    const existing = await prisma.room.findUnique({ where: { id: roomId } });
    if (!existing) {
      throw new NotFoundError('Room not found');
    }

    if (existing.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only remove listings you own');
    }

    await prisma.room.delete({ where: { id: roomId } });
    return { success: true, message: 'Room listing removed successfully' };
  }
}
