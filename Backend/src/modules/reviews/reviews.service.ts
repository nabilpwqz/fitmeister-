import { prisma } from '../../prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler';

export class ReviewsService {
  static async createReview(
    userId: string,
    data: {
      bookingId: string;
      rating: number;
      comment: string;
    }
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundError('Booking record not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError('Only the booker can review this session');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestError('Only confirmed bookings can be reviewed');
    }

    if (new Date(booking.endTime) > new Date()) {
      throw new BadRequestError('Reviews can only be submitted after the reserved session has completed');
    }

    if (booking.review) {
      throw new BadRequestError('A review has already been submitted for this reservation');
    }

    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        roomId: booking.roomId,
        userId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return review;
  }

  static async getRoomReviews(roomId: string) {
    return prisma.review.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }
}
