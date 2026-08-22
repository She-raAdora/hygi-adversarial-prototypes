import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { normalizeAnchor, normalizeDomain } from "@/lib/backlinkRisk";

export type BacklinkAlert = {
  id: string;
  target: string;
  kind: "domain" | "anchor";
  value: string;
  score: number;
  level: string;
  reasons: string[];
  acknowledged_at: string | null;
  created_at: string;
};

export type TrustedEntry = {
  id: string;
  kind: "domain" | "anchor";
  value: string;
  note: string | null;
  created_at: string;
};

export type AlertSettings = { threshold: number; enabled: boolean };

async function assertAdmin(context: { supabase: { rpc: (fn: string, args: unknown) => unknown } }) {
  const { data: isAdmin, error } = (await (
    context.supabase.rpc as (fn: string, args: unknown) => Promise<{ data: unknown; error: unknown }>
  )("current_user_has_role", { _role: "admin" })) as { data: unknown; error: unknown };
  if (error) throw error;
  if (isAdmin !== true) throw new Response("Forbidden", { status: 403 });
}

/** Admin-only: alert feed, allowlist, and the alert threshold in one round trip. */
export const getBacklinkAlertData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);

    const [alerts, trusted, settings] = await Promise.all([
      context.supabase
        .from("backlink_alerts")
        .select("id, target, kind, value, score, level, reasons, acknowledged_at, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      context.supabase
        .from("backlink_trusted_entries")
        .select("id, kind, value, note, created_at")
        .order("created_at", { ascending: false }),
      context.supabase
        .from("backlink_alert_settings")
        .select("threshold, enabled")
        .eq("id", "default")
        .maybeSingle(),
    ]);

    if (alerts.error) throw alerts.error;
    if (trusted.error) throw trusted.error;
    if (settings.error) throw settings.error;

    return {
      alerts: (alerts.data ?? []) as unknown as BacklinkAlert[],
      trusted: (trusted.data ?? []) as unknown as TrustedEntry[],
      settings: ((settings.data as AlertSettings | null) ?? {
        threshold: 60,
        enabled: true,
      }) as AlertSettings,
    };
  });

/** Admin-only: mark an alert as reviewed (or reopen it). */
export const acknowledgeBacklinkAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; acknowledged: boolean }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("backlink_alerts")
      .update({
        acknowledged_at: data.acknowledged ? new Date().toISOString() : null,
        acknowledged_by: data.acknowledged ? context.userId : null,
      } as never)
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

/** Admin-only: change the risk score that triggers an alert, or mute alerts. */
export const updateBacklinkAlertSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { threshold: number; enabled: boolean }) => ({
    threshold: Math.max(0, Math.min(100, Math.round(input.threshold))),
    enabled: Boolean(input.enabled),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("backlink_alert_settings")
      .upsert({ id: "default", threshold: data.threshold, enabled: data.enabled } as never)
      .eq("id", "default");
    if (error) throw error;
    return { ok: true as const, ...data };
  });

/**
 * Admin-only: add a referring domain or anchor to the allowlist. Anything
 * trusted is excluded from risk flagging, and its existing alerts are cleared
 * so the feed reflects the new decision immediately.
 */
export const addTrustedBacklinkEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { kind: "domain" | "anchor"; value: string; note?: string }) => {
    const kind = input.kind === "anchor" ? ("anchor" as const) : ("domain" as const);
    const value =
      kind === "domain" ? normalizeDomain(input.value ?? "") : normalizeAnchor(input.value ?? "");
    if (!value) throw new Error("Enter a domain or anchor text to trust.");
    if (value.length > 300) throw new Error("That value is too long.");
    const note = (input.note ?? "").trim().slice(0, 300);
    return { kind, value, note: note || null };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { error } = await context.supabase.from("backlink_trusted_entries").upsert(
      {
        kind: data.kind,
        value: data.value,
        note: data.note,
        created_by: context.userId,
      } as never,
      { onConflict: "kind,value" },
    );
    if (error) throw error;

    // Clear alerts this entry now covers.
    const { data: existing } = await context.supabase
      .from("backlink_alerts")
      .select("id, kind, value")
      .eq("kind", data.kind);
    const matching = ((existing ?? []) as { id: string; value: string }[]).filter((row) => {
      if (data.kind === "anchor") return normalizeAnchor(row.value) === data.value;
      const d = normalizeDomain(row.value);
      return d === data.value || d.endsWith(`.${data.value}`);
    });
    if (matching.length) {
      await context.supabase
        .from("backlink_alerts")
        .delete()
        .in(
          "id",
          matching.map((m) => m.id),
        );
    }

    return { ok: true as const, cleared: matching.length };
  });

/** Admin-only: stop trusting a domain or anchor. */
export const removeTrustedBacklinkEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("backlink_trusted_entries")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });
