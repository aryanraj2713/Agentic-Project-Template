import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  API_URL: z.url(),
  AUTH_COOKIE_NAME: z.string().min(1).default("session"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Resolve and validate server-only environment variables on demand. */
export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    API_URL: process.env.API_URL,
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables: ${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}
