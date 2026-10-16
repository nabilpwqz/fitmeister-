import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/fitmeister_db?schema=public'),
  JWT_SECRET: z.string().default('dev_jwt_secret_fallback_do_not_use_in_production_32chars'),
  SESSION_SECRET: z.string().default('dev_session_secret_fallback_do_not_use_in_production_32chars'),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
