import { createCheckoutSession } from "@/lib/actions/stripeActions";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const priceId = formData.get("priceId") as string;

  if (!priceId) {
    return new Response("Missing price ID", { status: 400 });
  }

  // Call the server action
  await createCheckoutSession(priceId);

  // The server action will redirect, so this won't be reached
  return new Response(null, { status: 200 });
}
