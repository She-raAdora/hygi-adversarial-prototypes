import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmailPreferences = {
  adminRoleEmails: boolean;
};

/** Reads the signed-in account's email notification preferences (defaults to opted in). */
export const getMyEmailPreferences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailPreferences> => {
    const { data, error } = await context.supabase
      .from("email_preferences")
      .select("admin_role_emails")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return { adminRoleEmails: data?.admin_role_emails ?? true };
  });

/** Updates the signed-in account's email notification preferences. */
export const updateMyEmailPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ adminRoleEmails: z.boolean() }).parse(input))
  .handler(async ({ data, context }): Promise<EmailPreferences> => {
    const { error } = await context.supabase.from("email_preferences").upsert(
      {
        user_id: context.userId,
        admin_role_emails: data.adminRoleEmails,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { adminRoleEmails: data.adminRoleEmails };
  });
