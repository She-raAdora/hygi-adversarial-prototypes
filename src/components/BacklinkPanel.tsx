import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDownRight, ArrowUpRight, Link2, ShieldAlert } from "lucide-react";

import {
  getBacklinkSnapshots,
  refreshBacklinkSnapshot,
  type BacklinkSnapshot,
} from "@/lib/backlinks.functions";
import { assessBacklinkRisk, type RiskLevel } from "@/lib/backlinkRisk";
import { getBacklinkAlertData } from "@/lib/backlink-alerts.functions";
import { BACKLINK_ALERT_QUERY_KEY } from "@/components/BacklinkAlertsPanel";

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-primary/10 text-primary",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-destructive/15 text-destructive-strong",
};

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${RISK_STYLES[level]}`}
    >
      {level === "low" ? "Low risk" : level === "medium" ? "Medium risk" : "High risk"}
    </span>
  );
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function delta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return null;
  return current - previous;
}

function Tile({
  label,
  value,
  change,
  hint,
}: {
  label: string;
  value: string;
  change?: number | null;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {change !== null && change !== undefined && change !== 0 ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {change > 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {change > 0 ? `+${change}` : change} since the previous snapshot
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function qualitySignals(snapshot: BacklinkSnapshot) {
  const follow = snapshot.follow_links ?? 0;
  const nofollow = snapshot.nofollow_links ?? 0;
  const total = follow + nofollow;
  const followShare = total > 0 ? Math.round((follow / total) * 100) : null;

  const domains = snapshot.domains ?? [];
  const scored = domains.filter((d) => typeof d.authority === "number");
  const lowAuthority = scored.filter((d) => (d.authority ?? 0) < 20).length;
  const lowShare = scored.length ? Math.round((lowAuthority / scored.length) * 100) : null;
  const strong = scored.filter((d) => (d.authority ?? 0) >= 40).length;

  return { followShare, lowShare, strong, scoredCount: scored.length };
}

/**
 * Backlink monitoring: referring-domain counts, link-quality signals, and the
 * new/lost domains between consecutive snapshots. Data comes from Semrush via
 * an admin-only server function.
 */
export function BacklinkPanel() {
  const queryClient = useQueryClient();
  const fetchSnapshots = useServerFn(getBacklinkSnapshots);
  const refresh = useServerFn(refreshBacklinkSnapshot);

  const { data: snapshots, isPending, isError } = useQuery({
    queryKey: ["backlink-snapshots"],
    queryFn: () => fetchSnapshots(),
    staleTime: 60_000,
  });

  const fetchAlertData = useServerFn(getBacklinkAlertData);
  const { data: alertData } = useQuery({
    queryKey: BACKLINK_ALERT_QUERY_KEY,
    queryFn: () => fetchAlertData(),
    staleTime: 60_000,
  });
  const trustedDomains = (alertData?.trusted ?? [])
    .filter((t) => t.kind === "domain")
    .map((t) => t.value);
  const trustedAnchors = (alertData?.trusted ?? [])
    .filter((t) => t.kind === "anchor")
    .map((t) => t.value);

  const capture = useMutation({
    mutationFn: () => refresh(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["backlink-snapshots"] });
      void queryClient.invalidateQueries({ queryKey: BACKLINK_ALERT_QUERY_KEY });
    },
  });

  const latest = snapshots?.[0];
  const previous = snapshots?.[1];
  const signals = latest ? qualitySignals(latest) : null;
  const risk = latest
    ? assessBacklinkRisk({
        domains: latest.domains ?? [],
        anchors: latest.anchors ?? [],
        trustedDomains,
        trustedAnchors,
      })
    : null;
  const riskByDomain = new Map((risk?.domains ?? []).map((d) => [d.domain, d]));

  return (
    <section aria-labelledby="backlinks-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="backlinks-heading" className="text-xl font-semibold tracking-tight">
          Backlink monitoring
        </h2>
        <button
          type="button"
          onClick={() => capture.mutate()}
          disabled={capture.isPending}
          className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          {capture.isPending ? "Capturing…" : "Capture snapshot"}
        </button>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Referring domains, link-quality signals, and the domains gained or lost since the previous
        snapshot. Source: Semrush.
      </p>

      <div aria-live="polite" className="mt-5 space-y-6">
        {capture.data && capture.data.ok === false ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-destructive-strong">
            {capture.data.message}
          </p>
        ) : null}
        {capture.data && capture.data.ok === true ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Snapshot captured: +{capture.data.newDomains} new / −{capture.data.lostDomains} lost
            referring domains
            {capture.data.alerts
              ? capture.data.alerts.enabled === false && capture.data.alerts.abuseEnabled === false
                ? " · all alerting is muted"
                : ` · ${capture.data.alerts.raised} new spam or abuse alert${
                    capture.data.alerts.raised === 1 ? "" : "s"
                  }`
              : ""}
            .
          </p>
        ) : null}
        {capture.isError ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-destructive-strong">
            Couldn't capture a snapshot — admin access is required.
          </p>
        ) : null}

        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading backlink history…</p>
        ) : isError ? (
          <p className="text-sm text-destructive-strong">
            Couldn't load backlink history — admin access is required to view it.
          </p>
        ) : !latest ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No snapshots yet. Capture one to start the history — each capture becomes a point in the
            new/lost backlink timeline.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Latest snapshot: {formatWhen(latest.captured_at)} · {latest.target}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Tile
                label="Referring domains"
                value={String(latest.referring_domains ?? "—")}
                change={delta(latest.referring_domains, previous?.referring_domains ?? null)}
                hint="Unique sites linking to you"
              />
              <Tile
                label="Total backlinks"
                value={String(latest.total_backlinks ?? "—")}
                change={delta(latest.total_backlinks, previous?.total_backlinks ?? null)}
              />
              <Tile
                label="Authority score"
                value={String(latest.authority_score ?? "—")}
                change={delta(latest.authority_score, previous?.authority_score ?? null)}
                hint="0–100, Semrush estimate"
              />
              <Tile
                label="Follow links"
                value={
                  signals?.followShare === null || signals?.followShare === undefined
                    ? "—"
                    : `${signals.followShare}%`
                }
                hint={`${latest.follow_links ?? 0} follow · ${latest.nofollow_links ?? 0} nofollow`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Link quality signals
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    Low-authority domains (score under 20):{" "}
                    <span className="font-medium text-foreground">
                      {signals?.lowShare === null ? "—" : `${signals?.lowShare}%`}
                    </span>{" "}
                    of {signals?.scoredCount ?? 0} scored domains
                  </li>
                  <li>
                    Strong domains (score 40+):{" "}
                    <span className="font-medium text-foreground">{signals?.strong ?? 0}</span>
                  </li>
                  <li>
                    Referring IPs:{" "}
                    <span className="font-medium text-foreground">
                      {latest.referring_ips ?? "—"}
                    </span>{" "}
                    — far fewer IPs than domains can signal link networks
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                  Since the previous snapshot
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      New ({latest.new_domains?.length ?? 0})
                    </p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {(latest.new_domains ?? []).slice(0, 8).map((d) => (
                        <li key={d} className="truncate">
                          {d}
                        </li>
                      ))}
                      {!latest.new_domains?.length ? (
                        <li className="text-muted-foreground">None</li>
                      ) : null}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Lost ({latest.lost_domains?.length ?? 0})
                    </p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {(latest.lost_domains ?? []).slice(0, 8).map((d) => (
                        <li key={d} className="truncate">
                          {d}
                        </li>
                      ))}
                      {!latest.lost_domains?.length ? (
                        <li className="text-muted-foreground">None</li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {risk ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Spam &amp; risk score
                </h3>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {risk.profileScore ?? "—"}
                      <span className="text-base font-normal text-muted-foreground">/100</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Profile risk — <RiskBadge level={risk.level} />
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {risk.spamShare === null ? "—" : `${risk.spamShare}%`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Referring domains flagged ({risk.flaggedDomains} of {risk.domains.length})
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">{risk.flaggedAnchors}</p>
                    <p className="text-xs text-muted-foreground">Suspicious anchor texts</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {risk.abuseProfileScore ?? "—"}<span className="text-base font-normal text-muted-foreground">/100</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Abuse risk — <RiskBadge level={risk.abuseLevel} /></p>
                  </div>
                </div>

                <h4 className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Abuse-related domains &amp; anchors
                </h4>
                {risk.flaggedAbuseDomains + risk.flaggedAbuseAnchors === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No abuse-related signals in this snapshot.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {risk.domains.filter((d) => d.abuseLevel !== "low").slice(0, 10).map((d) => (
                      <li key={`abuse-domain-${d.domain}`} className="text-sm">
                        <span className="font-medium">{d.domain}</span>{" "}<RiskBadge level={d.abuseLevel} />{" "}
                        <span className="text-muted-foreground">{d.abuseScore}/100 · referring domain</span>
                        <p className="text-xs text-muted-foreground">{d.abuseReasons.join(" · ")}</p>
                      </li>
                    ))}
                    {risk.anchors.filter((a) => a.abuseLevel !== "low").slice(0, 10).map((a) => (
                      <li key={`abuse-anchor-${a.anchor}`} className="text-sm">
                        <span className="font-medium break-words">“{a.anchor}”</span>{" "}<RiskBadge level={a.abuseLevel} />{" "}
                        <span className="text-muted-foreground">{a.abuseScore}/100 · anchor text</span>
                        <p className="text-xs text-muted-foreground">{a.abuseReasons.join(" · ")}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <h4 className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Flagged referring domains
                </h4>
                {risk.domains.filter((d) => d.level !== "low").length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nothing flagged in this snapshot.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {risk.domains
                      .filter((d) => d.level !== "low")
                      .slice(0, 10)
                      .map((d) => (
                        <li key={d.domain} className="text-sm">
                          <span className="font-medium">{d.domain}</span>{" "}
                          <RiskBadge level={d.level} /> <span className="text-muted-foreground">
                            {d.score}/100 · authority {d.authority ?? "—"} · {d.backlinks ?? "—"}{" "}
                            links
                          </span>
                          <p className="text-xs text-muted-foreground">{d.reasons.join(" · ")}</p>
                        </li>
                      ))}
                  </ul>
                )}

                <h4 className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Flagged anchor text
                </h4>
                {risk.anchors.filter((a) => a.level !== "low").length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No suspicious anchors in this snapshot.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {risk.anchors
                      .filter((a) => a.level !== "low")
                      .slice(0, 10)
                      .map((a) => (
                        <li key={a.anchor} className="text-sm">
                          <span className="font-medium break-words">“{a.anchor}”</span>{" "}
                          <RiskBadge level={a.level} />{" "}
                          <span className="text-muted-foreground">
                            {a.score}/100 · {a.backlinks ?? "—"} links from {a.domains ?? "—"}{" "}
                            domains
                          </span>
                          <p className="text-xs text-muted-foreground">{a.reasons.join(" · ")}</p>
                        </li>
                      ))}
                  </ul>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                  Trusted domains and anchors are excluded from these lists. Heuristic scoring of
                  Semrush data checks link-farm signals separately from abuse-related language.
                  A flag is a review prompt, not a verdict; review before disavowing anything.
                </p>
              </div>
            ) : null}

            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Top referring domains in the latest snapshot</caption>
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-medium">
                      Referring domain
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Authority
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Backlinks
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(latest.domains ?? []).slice(0, 15).map((d) => (
                    <tr key={d.domain} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-2.5">{d.domain}</td>
                      <td className="px-5 py-2.5">{d.authority ?? "—"}</td>
                      <td className="px-5 py-2.5">{d.backlinks ?? "—"}</td>
                      <td className="px-5 py-2.5">
                        {(() => {
                          const scored = riskByDomain.get(d.domain);
                          return scored ? (
                            <>
                              <RiskBadge level={scored.level} />{" "}
                              <span className="text-muted-foreground">
                                {scored.trusted ? "trusted" : scored.score}
                              </span>
                            </>
                          ) : (
                            "—"
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {snapshots.length > 1 ? (
              <div>
                <h3 className="text-sm font-semibold">Snapshot history</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {snapshots.map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-border bg-card px-4 py-2"
                    >
                      <span className="text-foreground">{formatWhen(s.captured_at)}</span>
                      <span>{s.referring_domains ?? "—"} referring domains</span>
                      <span>{s.total_backlinks ?? "—"} backlinks</span>
                      <span>
                        +{s.new_domains?.length ?? 0} new / −{s.lost_domains?.length ?? 0} lost
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
