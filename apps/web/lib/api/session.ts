import "server-only";

import { createClient } from "@/lib/api/generated/client";
import {
  createSessionAuthSessionPost,
  readSessionAuthSessionGet,
  type SessionToken,
  type SessionUser,
} from "@/lib/api/generated";
import { getApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { getServerEnv } from "@/lib/env";

export type { SessionToken, SessionUser };

/** Exchange credentials for a bearer token without exposing it to the browser. */
export async function createSession(
  username: string,
  password: string,
): Promise<SessionToken> {
  const client = createClient({
    baseUrl: getServerEnv().API_URL,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const result = await createSessionAuthSessionPost({
    body: { password, username },
    client,
  });

  if (result.error || !result.data) {
    throw new ApiError(result.response.status, "The supplied credentials were not accepted.");
  }
  return result.data;
}

/** Return the current server-side session, or null when no session exists. */
export async function getSession(): Promise<SessionUser | null> {
  const result = await readSessionAuthSessionGet({ client: await getApiClient() });
  if (result.response.status === 401) {
    return null;
  }
  if (result.error || !result.data) {
    throw new ApiError(result.response.status, "Unable to read the current session.");
  }
  return result.data;
}
