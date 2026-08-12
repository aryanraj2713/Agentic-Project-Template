import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Enter a username").max(255),
  password: z.string().min(1, "Enter a password").max(255),
});

export type SignInValues = z.infer<typeof signInSchema>;

export interface SignInState {
  message: string | null;
  fieldErrors: Partial<Record<"username" | "password", string[]>>;
}
