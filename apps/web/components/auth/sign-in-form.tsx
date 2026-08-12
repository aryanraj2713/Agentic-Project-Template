"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  signInSchema,
  type SignInState,
  type SignInValues,
} from "@/lib/auth-schema";

const initialSignInState: SignInState = {
  message: null,
  fieldErrors: {},
};

/** React Hook Form client validation backed by the sign-in Server Action. */
export function SignInForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(signIn, initialSignInState);
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  function submit(values: SignInValues): void {
    const formData = new FormData();
    formData.set("username", values.username);
    formData.set("password", values.password);
    formAction(formData);
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={form.handleSubmit(submit)}
    >
      <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="username">
        Username
        <input
          {...form.register("username")}
          aria-describedby="username-error"
          autoComplete="username"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          id="username"
        />
        <span className="text-destructive" id="username-error">
          {form.formState.errors.username?.message ?? state.fieldErrors.username?.[0]}
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="password">
        Password
        <input
          {...form.register("password")}
          aria-describedby="password-error"
          autoComplete="current-password"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          id="password"
          type="password"
        />
        <span className="text-destructive" id="password-error">
          {form.formState.errors.password?.message ?? state.fieldErrors.password?.[0]}
        </span>
      </label>

      {state.message ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button disabled={isPending} type="submit">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
