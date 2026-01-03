import { createCheckoutSession } from "@/lib/actions/stripeActions";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
  redirect("/pricing");
}

export async function POST(request: NextRequest) {
  let priceId: string | null = null;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      priceId = body.priceId;
    } else {
      const formData = await request.formData();
      priceId = formData.get("priceId") as string;
    }
  } catch (e) {
    return new Response("Invalid request", { status: 400 });
  }

  if (!priceId) {
    return new Response("Missing price ID", { status: 400 });
  }

  // Call the server action
  // Note: server actions use cookies/headers, which are available here.
  const result = await createCheckoutSession(priceId);

  // If the server action returned an error (e.g. Unauthorized)
  if (result && "error" in result) {
    return new Response(result.error, { status: 401 });
  }

  // If we reach here, createCheckoutSession should have triggered a redirect.
  // When called from a standard API route, we should return a 200 or 303.
  return new Response("Redirecting...", { status: 200 });
}
