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

/**
 * Authoritative, server-side capability check for the analytics debug tooling.
 *
 * Forcing the client UI open cannot grant this: the answer is derived from the
 * verified session and the admin role in the database. Returns 403 rather than
 * a soft `false` so callers cannot mistake a denial for a successful read.
 */
export const requireAnalyticsDebugCapability = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("current_user_has_role", {
      _role: "admin",
    });
    if (error) throw error;
    if (data !== true) throw new Response("Forbidden", { status: 403 });
    return { canInspect: true as const };
  });

