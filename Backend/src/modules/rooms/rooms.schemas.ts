import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  floor: z.string().min(1, 'Floor designation is required'),
  capacity: z.coerce.number().int().positive('Capacity must be greater than 0'),
  hourlyRate: z.coerce.number().positive('Hourly rate must be greater than 0'),
  city: z.string().default('Pabna'),
  address: z.string().default('Central Library Complex, Campus Row'),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  minDurationHours: z.coerce.number().int().min(1).default(1),
  maxDurationHours: z.coerce.number().int().max(12).default(8),
  bufferMinutes: z.coerce.number().int().min(0).default(15),
});

export const updateRoomSchema = createRoomSchema.partial().extend({
  isPublished: z.boolean().optional(),
});

export const roomQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  minCapacity: z.coerce.number().int().optional(),
  maxRate: z.coerce.number().optional(),
  amenity: z.union([z.string(), z.array(z.string())]).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'capacity_asc', 'capacity_desc', 'newest']).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
});
