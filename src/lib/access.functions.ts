import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns the signed-in account's email and whether it holds the admin role. */
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Self-scoped check: the account is derived from the verified session
    // inside the database, so no user id crosses the boundary.
    const { data, error } = await context.supabase.rpc("current_user_has_role", {
      _role: "admin",
    });
    if (error) throw error;
    return {
      email: (context.claims["email"] as string | undefined) ?? null,
      isAdmin: data === true,
    };
  });
