import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook Error: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  const supabase = createAdminClient();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve metadata
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (!userId) {
        console.error("Missing userId in session metadata");
        break;
      }

      // Update User Profile
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "pro", // Assuming only Pro Plan for now
          subscription_id: subscriptionId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        return new NextResponse("Database Error", { status: 500 });
      }
      break;
    }

    case "customer.subscription.deleted": {
      // Handle cancellation
      const subscription = event.data.object as Stripe.Subscription;
      // We need to find the user by subscription_id if metadata isn't on the subscription object directly
      // (Stripe copies metadata from Checkout to Subscription usually, but let's be safe)
      // Actually, best to query by subscription_id or customer_id

      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "free",
          subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("subscription_id", subscription.id);

      if (error) {
        // It might fail if user not found, strictly log it
        console.error("Error cancelling subscription:", error);
      }
      break;
    }

    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
