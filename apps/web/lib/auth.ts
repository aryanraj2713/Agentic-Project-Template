import "server-only";

import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/env";

/** Read the HttpOnly access token for server-rendered API calls. */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(getServerEnv().AUTH_COOKIE_NAME)?.value;
}
