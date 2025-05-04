import { z } from 'zod';

export const userEntitySchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }).optional(),
  name: z.string({ required_error: 'Name is required' }).min(4, { message: 'Name must be at least 4 character long' }),
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
  password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 character long' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export type UserEntitySchema = z.infer<typeof userEntitySchema>;
