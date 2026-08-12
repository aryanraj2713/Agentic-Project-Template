import { getItems } from "@/lib/api/items";

/** Server Component that streams the generic item collection. */
export async function ItemsList(): Promise<React.JSX.Element> {
  const items = await getItems();

  if (items.length === 0) {
    return <p className="text-muted-foreground">No items found.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-md border border-border px-4 py-2">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
