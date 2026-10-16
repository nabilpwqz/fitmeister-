import { prisma } from '../../prisma/client';
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler';

export class DashboardsService {
  static async getCustomerDashboard(userId: string) {
    const now = new Date();

    const [bookings, favorites, notifications] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        include: {
          room: {
            include: { images: { take: 1 } },
          },
          review: true,
        },
      }),
      prisma.favorite.findMany({
        where: { userId },
        include: {
          room: {
            include: { images: { take: 1 } },
          },
        },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const upcoming = bookings.filter(b => new Date(b.startTime) >= now && b.status === 'CONFIRMED');
    const past = bookings.filter(b => new Date(b.endTime) < now || b.status !== 'CONFIRMED');

    return {
      stats: {
        totalBookings: bookings.length,
        upcomingCount: upcoming.length,
        pastCount: past.length,
        favoritesCount: favorites.length,
      },
      upcoming,
      past,
      favorites: favorites.map(f => f.room),
      recentNotifications: notifications,
    };
  }

  static async getHostDashboard(userId: string) {
    const rooms = await prisma.room.findMany({
      where: { ownerId: userId },
      include: {
        images: { take: 1 },
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    const roomIds = rooms.map(r => r.id);

    const reservations = await prisma.booking.findMany({
      where: { roomId: { in: roomIds } },
      orderBy: { startTime: 'desc' },
      include: {
        room: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED');
    const grossRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      stats: {
        listingsCount: rooms.length,
        totalReservations: reservations.length,
        activeReservations: confirmedReservations.length,
        grossRevenue: Number(grossRevenue.toFixed(2)),
      },
      rooms,
      recentReservations: reservations.slice(0, 20),
    };
  }

  static async getAdminDashboard() {
    const [
      userCount,
      hostCount,
      adminCount,
      roomCount,
      bookingCount,
      confirmedBookings,
      recentUsers,
      recentRooms,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'HOST' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.room.count(),
      prisma.booking.count(),
      prisma.booking.findMany({ where: { status: 'CONFIRMED' }, select: { totalAmount: true } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.room.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const totalVolume = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      metrics: {
        totalUsers: userCount,
        hosts: hostCount,
        administrators: adminCount,
        totalListings: roomCount,
        totalReservations: bookingCount,
        grossPlatformVolume: Number(totalVolume.toFixed(2)),
      },
      recentUsers,
      recentRooms,
      auditLogs: recentLogs,
    };
  }

  static async adminModerateRoom(adminId: string, roomId: string, action: 'APPROVE' | 'SUSPEND') {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundError('Room not found');

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: { isApproved: action === 'APPROVE' },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: action === 'APPROVE' ? 'ROOM_APPROVED' : 'ROOM_SUSPENDED',
        targetType: 'ROOM',
        targetId: roomId,
        details: JSON.stringify({ roomName: room.name }),
      },
    });

    return updated;
  }

  static async adminChangeUserRole(adminId: string, targetUserId: string, newRole: 'CUSTOMER' | 'HOST' | 'ADMIN') {
    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundError('User not found');

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'USER_ROLE_PROMOTED',
        targetType: 'USER',
        targetId: targetUserId,
        details: JSON.stringify({ previousRole: target.role, newRole }),
      },
    });

    return updated;
  }
}
