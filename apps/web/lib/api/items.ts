import "server-only";

import { listItemsItemsGet, type ItemRead } from "@/lib/api/generated";
import { getApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export type Item = ItemRead;

/** Fetch the generic item collection during server rendering. */
export async function getItems(): Promise<Item[]> {
  const result = await listItemsItemsGet({ client: await getApiClient() });
  if (result.error || !result.data) {
    throw new ApiError(result.response.status, "Unable to load items.");
  }
  return result.data;
}
