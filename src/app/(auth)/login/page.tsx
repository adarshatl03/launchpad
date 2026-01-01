"use client";

import Link from "next/link";
import { useActionState } from "react";
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
import { login } from "@/lib/authActions";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="flex bg-neutral-950 min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-neutral-400">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
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
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline hover:text-neutral-200">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
