import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * Combines conditional class values via `clsx` and then resolves
 * conflicting Tailwind utility classes via `tailwind-merge`. This is the
 * standard shadcn/ui helper used throughout generated UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
