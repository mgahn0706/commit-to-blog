import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().default('file:./dev.db'),
  GITHUB_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  DEFAULT_GITHUB_USER_ID: z.string().default('demo-github-user'),
  DEFAULT_GITHUB_USERNAME: z.string().default('demo-user'),
  DEFAULT_GITHUB_AVATAR_URL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
