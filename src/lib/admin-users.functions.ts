import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AdminUser = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  isAdmin: boolean;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  // Self-scoped check: the database reads the role for auth.uid() only, so a
  // caller cannot assert admin by passing another account's id.
  const { data, error } = await context.supabase.rpc("current_user_has_role", {
    _role: "admin",
  });
  if (error) throw error;
  if (data !== true) throw new Error("Forbidden");
}

/** Lists every account with its admin status. Admin-only. */
export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listError) throw listError;

    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "admin");
    if (rolesError) throw rolesError;

    const admins = new Set((roles ?? []).map((r) => r.user_id));
    return list.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        isAdmin: admins.has(u.id),
      }))
      .sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
  });

/** Grants or revokes the admin role for another account. Admin-only. */
export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ userId: z.string().uuid(), makeAdmin: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId && !data.makeAdmin) {
      throw new Error("You can't revoke your own admin access.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.makeAdmin) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw error;
    }

    // Respect the affected account's opt-out before notifying them.
    const { wantsAdminRoleEmails } = await import("@/lib/notifications.server");
    const notify = await wantsAdminRoleEmails(data.userId);
    return { ok: true, notified: notify };
  });

/**
 * Bootstrap: lets the signed-in account become the first admin, but ONLY while
 * no admin exists yet AND the caller's verified email is on the server-side
 * owner allow-list (ADMIN_BOOTSTRAP_EMAILS). Without the allow-list the claim
 * is disabled entirely, so a random signup can never win the race.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const allowList = (process.env["ADMIN_BOOTSTRAP_EMAILS"] ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (allowList.length === 0) {
      throw new Error("Admin bootstrap is disabled. Contact the site operator.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Trust only the server-side account record, never client-supplied data.
    const { data: caller, error: callerError } =
      await supabaseAdmin.auth.admin.getUserById(context.userId);
    if (callerError) throw callerError;
    const email = caller.user?.email?.toLowerCase() ?? null;
    const confirmed = Boolean(
      caller.user?.email_confirmed_at ?? caller.user?.confirmed_at,
    );
    if (!email || !confirmed || !allowList.includes(email)) {
      throw new Error("This account is not authorized to claim the first admin seat.");
    }

    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw error;
    if ((count ?? 0) > 0) throw new Error("An administrator already exists.");

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertError) throw insertError;
    return { ok: true };
  });
