import { z } from 'zod';

export const CreateUrlSchema = z.object({
  originalUrl: z.string().url(),
  userId: z.string().uuid().optional(),
});

export type CreateUrlDto = z.infer<typeof CreateUrlSchema>;
