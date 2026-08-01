/**
 * Server-only helper: decides whether an account wants admin-role notification
 * emails. Anyone who has never touched the setting is treated as opted in.
 *
 * Email delivery itself waits on the sender domain being verified; every future
 * send of a role-change notice must go through this check first.
 */
export async function wantsAdminRoleEmails(userId: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("email_preferences")
    .select("admin_role_emails")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return true;
  return data?.admin_role_emails ?? true;
}
