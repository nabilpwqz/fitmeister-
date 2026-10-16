import { z } from 'zod';

export const createBookingSchema = z.object({
  roomId: z.string().uuid('Invalid room ID format'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO 8601 timestamp' }),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO 8601 timestamp' }),
  attendeeCount: z.coerce.number().int().positive().default(1),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  idempotencyKey: z.string().max(100).optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().max(250).optional(),
});
