import { z } from 'zod'
import dotenv from "dotenv"

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
});

dotenv.config();

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    throw new Error(
        'Invalid environment variables: ' +
          JSON.stringify(_env.error.format(), null, 4),
    );
}
export const env = _env.data;