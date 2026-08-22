import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { raiseRiskAlerts } from "@/lib/backlink-alerting";

export interface BacklinkSnapshot {
  id: string;
  captured_at: string;
  target: string;
  authority_score: number | null;
  trust_score: number | null;
  total_backlinks: number | null;
  referring_domains: number | null;
  referring_ips: number | null;
  follow_links: number | null;
  nofollow_links: number | null;
  domains: { domain: string; authority: number | null; backlinks: number | null }[];
  anchors: { anchor: string; domains: number | null; backlinks: number | null }[];
  new_domains: string[];
  lost_domains: string[];
}

const TARGET = "digitalhygiene.app";
const SELECT_COLUMNS =
  "id, captured_at, target, authority_score, trust_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links, domains, anchors, new_domains, lost_domains";

/** Admin-only: recorded backlink snapshots, newest first. */
export const getBacklinkSnapshots = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc(
      "current_user_has_role",
      { _role: "admin" },
    );
    if (roleError) throw roleError;
    if (isAdmin !== true) throw new Response("Forbidden", { status: 403 });

    const { data, error } = await context.supabase
      .from("backlink_snapshots")
      .select(SELECT_COLUMNS)
      .eq("target", TARGET)
      .order("captured_at", { ascending: false })
      .limit(12);
    if (error) throw error;
    return (data ?? []) as unknown as BacklinkSnapshot[];
  });

/**
 * Admin-only: pull a fresh backlink profile from Semrush, diff the referring
 * domains against the previous snapshot, and record the result.
 */
export const refreshBacklinkSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc(
      "current_user_has_role",
      { _role: "admin" },
    );
    if (roleError) throw roleError;
    if (isAdmin !== true) throw new Response("Forbidden", { status: 403 });

    const { fetchBacklinkReport } = await import("@/lib/backlinks.server");

    let report;
    try {
      report = await fetchBacklinkReport(TARGET);
    } catch (error) {
      console.error("Backlink refresh failed", error);
      return {
        ok: false as const,
        message:
          error instanceof Error ? error.message : "Couldn't reach the backlink data service.",
      };
    }

    const { data: previous } = await context.supabase
      .from("backlink_snapshots")
      .select("domains, anchors")
      .eq("target", TARGET)
      .order("captured_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const previousDomains = new Set(
      (((previous as { domains?: { domain: string }[] } | null)?.domains ?? []) as {
        domain: string;
      }[]).map((d) => d.domain),
    );
    const previousAnchors = new Set(
      (((previous as { anchors?: { anchor: string }[] } | null)?.anchors ?? []) as {
        anchor: string;
      }[]).map((a) => a.anchor),
    );
    const currentDomains = new Set(report.domains.map((d) => d.domain));

    const newDomains = [...currentDomains].filter((d) => !previousDomains.has(d));
    const lostDomains = previousDomains.size
      ? [...previousDomains].filter((d) => !currentDomains.has(d))
      : [];

    const { data: inserted, error: insertError } = await context.supabase
      .from("backlink_snapshots")
      .insert({
        target: TARGET,
        authority_score: report.authorityScore,
        trust_score: report.trustScore,
        total_backlinks: report.totalBacklinks,
        referring_domains: report.referringDomains,
        referring_ips: report.referringIps,
        follow_links: report.followLinks,
        nofollow_links: report.nofollowLinks,
        domains: report.domains,
        anchors: report.anchors,
        new_domains: newDomains,
        lost_domains: lostDomains,
      } as never)
      .select("id")
      .maybeSingle();
    if (insertError) throw insertError;

    const alerts = await raiseRiskAlerts({
      supabase: context.supabase,
      target: TARGET,
      snapshotId: (inserted as { id?: string } | null)?.id ?? null,
      newDomains,
      domains: report.domains,
      anchors: report.anchors,
      previousAnchors: previousAnchors,
    });

    return {
      ok: true as const,
      newDomains: newDomains.length,
      lostDomains: lostDomains.length,
      referringDomains: report.referringDomains,
      alerts,
    };
  });
