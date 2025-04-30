import { z } from 'zod';

export const urlEntitySchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }).optional(),
  shortCode: z
    .string()
    .min(6, { message: 'Short code must be 6 characters long' })
    .max(6, { message: 'Short code must be 6 characters long' }),
  originalUrl: z.string({ message: 'Original URL is required' }).url({ message: 'Invalid URL' }),
  userId: z.string({ message: 'User ID is required' }).uuid({ message: 'Invalid User ID' }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  clickCount: z.number().nonnegative({ message: 'Click count must be a positive number' }).optional(),
  lastClickDate: z.date().optional(),
});

export type UrlEntitySchema = z.infer<typeof urlEntitySchema>;
