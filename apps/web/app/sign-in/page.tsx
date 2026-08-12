import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-muted-foreground">
        This template uses a generic server-managed session example.
      </p>
      <SignInForm />
    </main>
  );
}
