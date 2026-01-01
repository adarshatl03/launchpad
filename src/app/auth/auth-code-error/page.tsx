import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthCodeError() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-950 gap-4 text-center">
      <h1 className="text-4xl font-bold text-red-500">Authentication Error</h1>
      <p className="text-neutral-400">
        There was an issue authenticating your account. Please try again.
      </p>
      <Button
        asChild
        className="mt-4 bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
      >
        <Link href="/login">Return to Login</Link>
      </Button>
    </div>
  );
}
