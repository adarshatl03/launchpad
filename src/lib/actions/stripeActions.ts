"use server";

import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Get user profile to check for existing customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  // 2. Create Customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.full_name || undefined,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;

    // Save to DB
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  // 3. Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout_success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?checkout_canceled=true`,
    metadata: {
      userId: user.id,
    },
  });

  if (!session.url) {
    return { error: "Failed to create checkout session" };
  }

  redirect(session.url);
}

export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { error: "No billing profile found" };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  redirect(session.url);
}
