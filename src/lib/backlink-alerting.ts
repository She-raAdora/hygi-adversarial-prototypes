import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import {
  isAnchorTrusted,
  isDomainTrusted,
  scoreAnchor,
  scoreDomain,
  type RiskLevel,
} from "@/lib/backlinkRisk";

type Client = SupabaseClient<Database>;

/**
 * Raise alerts for newly seen referring domains and anchor texts whose spam/risk
 * score crosses the configured threshold. Allowlisted ("trusted") domains and
 * anchors are skipped entirely, and alerts are de-duplicated per value so a
 * repeat capture doesn't re-notify for something already in the feed.
 */
export async function raiseRiskAlerts(input: {
  supabase: Client;
  target: string;
  snapshotId: string | null;
  newDomains: string[];
  domains: { domain: string; authority: number | null; backlinks: number | null }[];
  anchors: { anchor: string; domains: number | null; backlinks: number | null }[];
  previousAnchors: Set<string>;
}) {
  const { supabase } = input;

  const [{ data: settings }, { data: trusted }] = await Promise.all([
    supabase
      .from("backlink_alert_settings")
      .select("threshold, enabled")
      .eq("id", "default")
      .maybeSingle(),
    supabase.from("backlink_trusted_entries").select("kind, value"),
  ]);

  const threshold = settings?.threshold ?? 60;
  if (settings && settings.enabled === false) {
    return { raised: 0, threshold, enabled: false as const };
  }

  const trustedRows = (trusted ?? []) as { kind: string; value: string }[];
  const trustedDomains = trustedRows.filter((r) => r.kind === "domain").map((r) => r.value);
  const trustedAnchors = trustedRows.filter((r) => r.kind === "anchor").map((r) => r.value);

  const newDomainSet = new Set(input.newDomains);
  const rows: {
    target: string;
    kind: "domain" | "anchor";
    value: string;
    score: number;
    level: RiskLevel;
    reasons: string[];
    snapshot_id: string | null;
  }[] = [];

  for (const domain of input.domains) {
    if (!newDomainSet.has(domain.domain)) continue;
    if (isDomainTrusted(domain.domain, trustedDomains)) continue;
    const scored = scoreDomain(domain);
    if (scored.score < threshold) continue;
    rows.push({
      target: input.target,
      kind: "domain",
      value: domain.domain,
      score: scored.score,
      level: scored.level,
      reasons: scored.reasons,
      snapshot_id: input.snapshotId,
    });
  }

  for (const anchor of input.anchors) {
    if (input.previousAnchors.size && input.previousAnchors.has(anchor.anchor)) continue;
    if (isAnchorTrusted(anchor.anchor, trustedAnchors)) continue;
    const scored = scoreAnchor(anchor);
    if (scored.score < threshold) continue;
    rows.push({
      target: input.target,
      kind: "anchor",
      value: anchor.anchor,
      score: scored.score,
      level: scored.level,
      reasons: scored.reasons,
      snapshot_id: input.snapshotId,
    });
  }

  if (!rows.length) return { raised: 0, threshold, enabled: true as const };

  const { error } = await supabase
    .from("backlink_alerts")
    .upsert(rows as never, { onConflict: "target,kind,value", ignoreDuplicates: true });
  if (error) {
    console.error("Couldn't record backlink risk alerts", error);
    return { raised: 0, threshold, enabled: true as const };
  }

  return { raised: rows.length, threshold, enabled: true as const };
}
