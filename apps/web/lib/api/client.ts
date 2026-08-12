import "server-only";

import { createClient, type Client } from "@/lib/api/generated/client";
import { getAccessToken } from "@/lib/auth";
import { getServerEnv } from "@/lib/env";

/** Configure a server-only instance of the generated Hey API client. */
export async function getApiClient(): Promise<Client> {
  const { API_URL } = getServerEnv();
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = { Accept: "application/json" };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return createClient({
    baseUrl: API_URL,
    cache: "no-store",
    headers,
  });
}
