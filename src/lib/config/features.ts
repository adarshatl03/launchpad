export const FEATURE_CATEGORIES = [
  {
    id: "auth",
    title: "Authentication",
    features: [
      { id: "email_pass", label: "Email & Password", cost: 5 },
      { id: "social", label: "Social Login (Google/GitHub)", cost: 10 },
      { id: "mfa", label: "2FA / MFA", cost: 15 },
    ],
  },
  {
    id: "core",
    title: "Core Functionality",
    features: [
      { id: "crud", label: "Basic CRUD Operations", cost: 10 },
      { id: "fileupload", label: "File Uploads", cost: 10 },
      { id: "search", label: "Full-text Search", cost: 15 },
      { id: "realtime", label: "Real-time Updates", cost: 25 },
    ],
  },
  {
    id: "monetization",
    title: "Monetization",
    features: [
      { id: "stripe", label: "Stripe Subscription", cost: 20 },
      { id: "freemium", label: "Freemium Logic", cost: 10 },
      { id: "marketplace", label: "Marketplace / Commission", cost: 30 },
    ],
  },
];
