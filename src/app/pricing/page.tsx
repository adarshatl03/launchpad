import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PricingClient } from "@/components/pricing/PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the right plan for your SaaS journey. Simple, transparent pricing for entrepreneurs and small teams.",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PricingClient user={user} />;
}
