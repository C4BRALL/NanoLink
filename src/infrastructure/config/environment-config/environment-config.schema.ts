import { z } from 'zod';

export const environmentConfigSchema = z.object({
  API_PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_LOGGING: z.coerce.boolean().default(false),
  DB_DOMAIN: z.string().url().min(1),
});

export type environmentConfigSchema = z.infer<typeof environmentConfigSchema>;
