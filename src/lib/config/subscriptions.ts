export interface SubscriptionPlan {
  id: string; // 'free' | 'pro'
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For hobbyists and students",
    stripePriceId: "", // Always empty for free
    price: 0,
    features: ["1 Product Plan", "Basic Rules Engine", "Community Support"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious founders",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "", // From Env
    price: 1900, // $19.00 in cents
    features: [
      "Unlimited Plans",
      "Advanced Rules Engine",
      "PDF & DOCX Export",
      "Priority Support",
    ],
  },
];
