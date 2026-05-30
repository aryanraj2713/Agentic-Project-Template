/**
 * Typed helpers for talking to the Backend_App.
 *
 * Components must call these helpers rather than invoking `fetch` inline, so
 * that the base-URL lookup, error handling, and response typing live in a
 * single place. The backend base URL is read from the `NEXT_PUBLIC_API_URL`
 * environment variable.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Resolve the backend base URL, throwing a named error when it is absent.
 *
 * The check runs at call time (when a helper executes) rather than at module
 * load, so that importing this module never crashes and the error clearly
 * names the missing variable.
 */
function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_API_URL",
    );
  }
  return API_URL;
}

/** Generic placeholder resource mirroring the backend `/items` contract. */
export interface Item {
  id: number;
  name: string;
}

/**
 * Fetch the list of items from the backend.
 *
 * @throws Error if `NEXT_PUBLIC_API_URL` is missing or the request returns a
 * non-success HTTP status.
 */
export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${requireApiUrl()}/items`);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return (await res.json()) as Item[];
}
