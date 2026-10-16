import { prisma } from '../../prisma/client';
import { NotFoundError } from '../../middleware/errorHandler';

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  startHour: number; // e.g. 9
  endHour: number;   // e.g. 10
  isAvailable: boolean;
  conflictReason?: 'BOOKED' | 'BLOCKED' | 'OUTSIDE_HOURS';
}

export class AvailabilityService {
  static async getRoomAvailabilityForDate(roomId: string, dateStr: string): Promise<{
    date: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    bufferMinutes: number;
    slots: TimeSlot[];
  }> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        operatingHours: true,
        availabilityBlocks: true,
      },
    });

    if (!room) {
      throw new NotFoundError(`Room with id '${roomId}' not found`);
    }

    // Determine target day of week
    // dateStr format: YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const dayOfWeek = targetDate.getUTCDay();

    const opHour = room.operatingHours.find(o => o.dayOfWeek === dayOfWeek);
    if (!opHour || !opHour.isOpen) {
      return {
        date: dateStr,
        isOpen: false,
        bufferMinutes: room.bufferMinutes,
        slots: [],
      };
    }

    const [openHour] = opHour.openTime.split(':').map(Number);
    const [closeHour] = opHour.closeTime.split(':').map(Number);

    // Fetch all active confirmed reservations for this room that touch this day
    const dayStartUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const dayEndUtc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const existingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: 'CONFIRMED',
        startTime: { lte: dayEndUtc },
        endTime: { gte: dayStartUtc },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Fetch active blackout blocks
    const existingBlocks = await prisma.availabilityBlock.findMany({
      where: {
        roomId,
        startTime: { lte: dayEndUtc },
        endTime: { gte: dayStartUtc },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const slots: TimeSlot[] = [];

    for (let hour = openHour; hour < closeHour; hour++) {
      const slotStart = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));
      const slotEnd = new Date(Date.UTC(year, month - 1, day, hour + 1, 0, 0));

      // Overlap formula for half-open interval [slotStart, slotEnd):
      // slotStart < booking.endTime && slotEnd > booking.startTime
      const hasBookingConflict = existingBookings.some(b => {
        return slotStart < b.endTime && slotEnd > b.startTime;
      });

      const hasBlockConflict = existingBlocks.some(block => {
        return slotStart < block.endTime && slotEnd > block.startTime;
      });

      let isAvailable = !hasBookingConflict && !hasBlockConflict;
      let conflictReason: TimeSlot['conflictReason'] = undefined;

      if (hasBookingConflict) {
        conflictReason = 'BOOKED';
      } else if (hasBlockConflict) {
        conflictReason = 'BLOCKED';
      }

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        startHour: hour,
        endHour: hour + 1,
        isAvailable,
        conflictReason,
      });
    }

    return {
      date: dateStr,
      isOpen: true,
      openTime: opHour.openTime,
      closeTime: opHour.closeTime,
      bufferMinutes: room.bufferMinutes,
      slots,
    };
  }
}
