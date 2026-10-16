import { prisma } from '../../prisma/client';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../middleware/errorHandler';
import { notifyAvailabilityChanged } from '../../socket';

export class BookingsService {
  static async createBooking(
    userId: string,
    data: {
      roomId: string;
      date: string;
      startTime: string;
      endTime: string;
      attendeeCount: number;
      notes?: string;
      idempotencyKey?: string;
    }
  ) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid start or end timestamp');
    }

    if (end <= start) {
      throw new BadRequestError('Booking end time must be later than start time');
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours <= 0) {
      throw new BadRequestError('Duration must be positive');
    }

    // Run booking creation inside a database transaction
    const createdBooking = await prisma.$transaction(async tx => {
      // 0. Acquire row-level lock to prevent concurrent double-booking race conditions
      try {
        await tx.$queryRaw`SELECT id FROM "Room" WHERE id = ${data.roomId} FOR UPDATE`;
      } catch (lockErr) {
        // Fallback if provider doesn't support SELECT FOR UPDATE
      }

      // 1. Idempotency safeguard
      if (data.idempotencyKey) {
        const existingIdempotent = await tx.booking.findUnique({
          where: { idempotencyKey: data.idempotencyKey },
          include: {
            room: {
              include: { images: { take: 1 } },
            },
          },
        });
        if (existingIdempotent) {
          return existingIdempotent;
        }
      }

      // 2. Fetch room with operating hours and availability blocks
      const room = await tx.room.findUnique({
        where: { id: data.roomId },
        include: {
          operatingHours: true,
          availabilityBlocks: true,
        },
      });

      if (!room) {
        throw new NotFoundError('Target room does not exist');
      }

      if (!room.isPublished || !room.isApproved) {
        throw new BadRequestError('This room is not currently available for reservation');
      }

      if (data.attendeeCount > room.capacity) {
        throw new BadRequestError(`Attendee count (${data.attendeeCount}) exceeds room capacity (${room.capacity})`);
      }

      if (durationHours < room.minDurationHours) {
        throw new BadRequestError(`Minimum reservation duration is ${room.minDurationHours} hour(s)`);
      }

      if (durationHours > room.maxDurationHours) {
        throw new BadRequestError(`Maximum reservation duration is ${room.maxDurationHours} hour(s)`);
      }

      // 3. Operating hours validation
      const dayOfWeek = start.getUTCDay();
      const opHour = room.operatingHours.find(o => o.dayOfWeek === dayOfWeek);

      if (!opHour || !opHour.isOpen) {
        throw new BadRequestError('The facility is closed on this day of the week');
      }

      const [openH, openM] = opHour.openTime.split(':').map(Number);
      const [closeH, closeM] = opHour.closeTime.split(':').map(Number);

      const startUtcHour = start.getUTCHours() + start.getUTCMinutes() / 60;
      const endUtcHour = end.getUTCHours() + end.getUTCMinutes() / 60;
      const facilityOpen = openH + (openM || 0) / 60;
      const facilityClose = closeH + (closeM || 0) / 60;

      if (startUtcHour < facilityOpen || endUtcHour > facilityClose) {
        throw new BadRequestError(
          `Requested time falls outside operating hours (${opHour.openTime} - ${opHour.closeTime})`
        );
      }

      // 4. Blackout period validation
      const hasBlockConflict = room.availabilityBlocks.some(block => {
        return start < block.endTime && end > block.startTime;
      });

      if (hasBlockConflict) {
        throw new ConflictError('The requested window overlaps with a host-maintained blackout block');
      }

      // 5. Database-level Overlap Conflict Detection
      // Half-open interval collision: start < existing.endTime && end > existing.startTime
      const conflict = await tx.booking.findFirst({
        where: {
          roomId: data.roomId,
          status: 'CONFIRMED',
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      if (conflict) {
        throw new ConflictError(
          'Scheduling conflict: The selected time slot has already been reserved by another customer. Please choose an adjacent slot.'
        );
      }

      // 6. Server-side price computation
      const totalAmount = Number((durationHours * room.hourlyRate).toFixed(2));

      // 7. Persist reservation
      const booking = await tx.booking.create({
        data: {
          roomId: data.roomId,
          userId,
          date: data.date,
          startTime: start,
          endTime: end,
          attendeeCount: data.attendeeCount,
          totalAmount,
          status: 'CONFIRMED',
          notes: data.notes,
          idempotencyKey: data.idempotencyKey,
        },
        include: {
          room: {
            include: { images: { take: 1 } },
          },
        },
      });

      // 8. Notifications for customer and host
      await tx.notification.createMany({
        data: [
          {
            userId,
            title: 'Reservation Confirmed',
            message: `Your reservation for "${room.name}" on ${data.date} is confirmed. Total: $${totalAmount}.`,
            link: '/dashboard/bookings',
          },
          {
            userId: room.ownerId,
            title: 'New Room Booking',
            message: `A learner reserved "${room.name}" for ${data.date} (${durationHours} hrs).`,
            link: '/dashboard/host/reservations',
          },
        ],
      });

      return booking;
    });

    notifyAvailabilityChanged(data.roomId, data.date);
    return createdBooking;
  }

  static async cancelBooking(bookingId: string, userId: string, userRole: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      throw new NotFoundError('Booking record not found');
    }

    if (booking.userId !== userId && booking.room.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to cancel this reservation');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestError('This reservation is already cancelled');
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { room: true },
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Reservation Cancelled',
        message: `Your booking for "${booking.room.name}" on ${booking.date} has been cancelled.`,
        link: '/dashboard/bookings',
      },
    });

    notifyAvailabilityChanged(booking.roomId, booking.date);
    return updated;
  }

  static async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      include: {
        room: {
          include: {
            images: { take: 1 },
          },
        },
        review: {
          select: { id: true, rating: true, comment: true },
        },
      },
    });

    const now = new Date();

    return bookings.map(b => {
      const isPast = new Date(b.endTime) < now;
      const canReview = isPast && b.status === 'CONFIRMED' && !b.review;
      const canCancel = !isPast && b.status === 'CONFIRMED';

      return {
        ...b,
        canReview,
        canCancel,
        isPast,
      };
    });
  }

  static async getBookingById(bookingId: string, userId: string, userRole: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: { images: true, owner: { select: { id: true, name: true, email: true } } },
        },
        user: { select: { id: true, name: true, email: true } },
        review: true,
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId !== userId && booking.room.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('Access to this booking is unauthorized');
    }

    return booking;
  }
}
