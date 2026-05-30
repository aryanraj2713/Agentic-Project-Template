"use client";

import { useEffect, useState } from "react";

import { fetchItems, type Item } from "@/lib/api";

/**
 * Generic Example_Page demonstrating the standard data-fetching pattern.
 *
 * This page is intentionally free of project-specific business logic: it calls
 * a typed helper from `lib/api.ts` (never `fetch` inline), renders a loading
 * state while the request is pending, renders an error state when the request
 * fails, and renders the returned items on success. Clone it as a starting
 * point for real pages.
 */
export default function Home(): React.JSX.Element {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function loadItems(): Promise<void> {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchItems();
        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Fullstack Monorepo Template</h1>
        <p className="text-sm text-gray-500">
          Example page: fetches items from the backend with loading and error
          states.
        </p>
      </header>

      <section aria-busy={isLoading}>
        {isLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : error !== null ? (
          <p role="alert" className="text-red-600">
            Failed to load items: {error}
          </p>
        ) : items && items.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-gray-200 px-4 py-2"
              >
                {item.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </section>
    </main>
  );
}
