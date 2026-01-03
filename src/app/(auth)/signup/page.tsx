"use client";

import Link from "next/link";
import { useActionState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { signup } from "@/lib/authActions";
import { useSearchParams } from "next/navigation";

function SignupForm() {
  const [state, action, isPending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const redirectTo = inviteToken ? `/invite/${inviteToken}` : "/dashboard";

  return (
    <Card className="w-full max-w-sm border-neutral-800 bg-neutral-900 text-neutral-50">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className="text-neutral-400">
          {inviteToken
            ? "Join your team by creating an account"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              required
              className="bg-neutral-950 border-neutral-800 text-neutral-50 placeholder:text-neutral-600 focus-visible:ring-neutral-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-neutral-950 border-neutral-800 text-neutral-50 placeholder:text-neutral-600 focus-visible:ring-neutral-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-neutral-950 border-neutral-800 text-neutral-50 placeholder:text-neutral-600 focus-visible:ring-neutral-700"
            />
          </div>
          {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create an account"}
          </Button>
          <div className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              href={inviteToken ? `/login?invite=${inviteToken}` : "/login"}
              className="underline hover:text-neutral-200"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="flex bg-neutral-950 min-h-screen items-center justify-center px-4">
      <Suspense
        fallback={<div className="text-neutral-400">Loading signup...</div>}
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
