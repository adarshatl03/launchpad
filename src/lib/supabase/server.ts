import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();

  // TRANSITION: E2E Testing Mock
  if (cookieStore.has("__e2e_mock_session")) {
    const chainable = () => ({
      select: () => chainable(),
      insert: () => chainable(),
      update: () => chainable(),
      delete: () => chainable(),
      impersonate: () => chainable(),
      eq: () => chainable(),
      neq: () => chainable(),
      gt: () => chainable(),
      lt: () => chainable(),
      gte: () => chainable(),
      lte: () => chainable(),
      like: () => chainable(),
      ilike: () => chainable(),
      is: () => chainable(),
      in: () => chainable(),
      contains: () => chainable(),
      containedBy: () => chainable(),
      rangeGt: () => chainable(),
      rangeGte: () => chainable(),
      rangeLt: () => chainable(),
      rangeLte: () => chainable(),
      rangeAdjacent: () => chainable(),
      overlaps: () => chainable(),
      textSearch: () => chainable(),
      match: () => chainable(),
      not: () => chainable(),
      or: () => chainable(),
      filter: () => chainable(),
      order: () => chainable(),
      limit: () => chainable(),
      offset: () => chainable(),
      single: async () => ({
        data: { id: "mock-plan-id", user_id: "test-user-id" },
        error: null,
      }),
      maybeSingle: async () => ({ data: { id: "mock-plan-id" }, error: null }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: async (resolve: any) => resolve({ data: [], error: null }),
    });

    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "test-user-id",
              email: "test@example.com",
              user_metadata: { full_name: "Test User" },
              aud: "authenticated",
              role: "authenticated",
            },
          },
          error: null,
        }),
      },
      from: () => chainable(),
    } as unknown as SupabaseClient;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
