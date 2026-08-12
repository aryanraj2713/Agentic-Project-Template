import { Suspense } from "react";

import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { ItemsList } from "@/components/items-list";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/api/session";

// Session cookies and the server-only API URL are resolved for each request.
export const dynamic = "force-dynamic";

export default function Home(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Fullstack Monorepo Template</h1>
        <p className="text-sm text-muted-foreground">
          Server-rendered items, streamed with Suspense.
        </p>
      </header>

      <SessionControls />

      <section>
        <Suspense fallback={<p className="text-muted-foreground">Loading items…</p>}>
          <ItemsList />
        </Suspense>
      </section>
    </main>
  );
}

async function SessionControls(): Promise<React.JSX.Element> {
  const session = await getSession();

  if (!session) {
    return (
      <Link className="w-fit text-sm underline" href="/sign-in">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span>Signed in as {session.username}</span>
      <form action={signOut}>
        <Button size="sm" type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  );
}
