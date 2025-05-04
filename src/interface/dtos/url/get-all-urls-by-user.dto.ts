import { z } from 'zod';

export const GetAllUrlsByUserSchema = z.object({
  userId: z.string().uuid().min(1),
});

export type GetAllUrlsByUserDto = z.infer<typeof GetAllUrlsByUserSchema>;
