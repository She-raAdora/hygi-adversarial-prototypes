import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Permanently deletes the signed-in account and every row keyed to it.
 *
 * Required by App Store guideline 5.1.1(v): account deletion must be possible
 * from inside the app. Rows in public tables cascade from auth.users, but we
 * clear them explicitly so nothing lingers if a cascade is ever dropped.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    await supabaseAdmin.from("email_preferences").delete().eq("user_id", userId);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return { ok: true };
  });
