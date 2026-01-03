"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

import { loginSchema, signupSchema } from "./schemas";

export type FormState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function login(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const redirectTo = formData.get("redirectTo") as string;

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

export async function signup(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, fullName } = parsed.data;
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  const redirectTo = formData.get("redirectTo") as string;

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
