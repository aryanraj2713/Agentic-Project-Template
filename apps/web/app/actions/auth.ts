"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSession, type SessionToken } from "@/lib/api/session";
import { signInSchema, type SignInState } from "@/lib/auth-schema";
import { getServerEnv } from "@/lib/env";

const initialSignInState: SignInState = {
  message: null,
  fieldErrors: {},
};

/** Validate a sign-in request and store its access token in an HttpOnly cookie. */
export async function signIn(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const result = signInSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      message: "Check the highlighted fields.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  let session: SessionToken;
  try {
    session = await createSession(result.data.username, result.data.password);
  } catch {
    return {
      message: "Unable to sign in. Check your credentials and try again.",
      fieldErrors: {},
    };
  }

  const cookieStore = await cookies();
  const maxAge = Math.max(
    0,
    Math.floor((Date.parse(session.expires_at) - Date.now()) / 1_000),
  );

  cookieStore.set(getServerEnv().AUTH_COOKIE_NAME, session.access_token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
  redirect("/");
}

/** Clear the HttpOnly session cookie and refresh server-rendered UI. */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getServerEnv().AUTH_COOKIE_NAME);
  revalidatePath("/", "layout");
}
