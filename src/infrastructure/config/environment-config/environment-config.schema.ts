import { z } from 'zod';

export const environmentConfigSchema = z.object({
  API_PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  API_DOMAIN: z.string().url().min(1),
  DB_LOGGING: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  DB_TYPEORM_SYNC: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  LOGTAIL_TOKEN: z.string().min(1),
  NODE_ENV: z.string().min(1),
  LOGTAIL_ENDPOINT: z.string().min(1),
  JWT_SECRET: z.string().min(1).default('secret'),
  JWT_EXPIRES_IN: z.string().min(1).default('15m'),
  DB_USE_SSL: z.preprocess((val) => val === 'true', z.boolean().default(false)),
});

export type environmentConfigSchema = z.infer<typeof environmentConfigSchema>;
