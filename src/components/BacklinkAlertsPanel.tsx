import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BellRing, Check, ShieldCheck, Trash2 } from "lucide-react";

import {
  acknowledgeBacklinkAlert,
  addTrustedBacklinkEntry,
  getBacklinkAlertData,
  removeTrustedBacklinkEntry,
  updateBacklinkAlertSettings,
} from "@/lib/backlink-alerts.functions";

export const BACKLINK_ALERT_QUERY_KEY = ["backlink-alert-data"] as const;

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Risk alerts and the trusted-domain/anchor allowlist. Alerts are raised when a
 * newly seen referring domain or anchor scores at or above the threshold; trusted
 * entries are excluded from both flagging and alerts.
 */
export function BacklinkAlertsPanel() {
  const queryClient = useQueryClient();
  const fetchData = useServerFn(getBacklinkAlertData);
  const acknowledge = useServerFn(acknowledgeBacklinkAlert);
  const addTrusted = useServerFn(addTrustedBacklinkEntry);
  const removeTrusted = useServerFn(removeTrustedBacklinkEntry);
  const saveSettings = useServerFn(updateBacklinkAlertSettings);

  const { data, isPending, isError } = useQuery({
    queryKey: BACKLINK_ALERT_QUERY_KEY,
    queryFn: () => fetchData(),
    staleTime: 60_000,
  });

  const [kind, setKind] = useState<"domain" | "anchor">("domain");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [threshold, setThreshold] = useState<number | null>(null);
  const [abuseThreshold, setAbuseThreshold] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: BACKLINK_ALERT_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: ["backlink-snapshots"] });
  };

  const ackMutation = useMutation({
    mutationFn: (input: { id: string; acknowledged: boolean }) => acknowledge({ data: input }),
    onSuccess: invalidate,
  });
  const addMutation = useMutation({
    mutationFn: (input: { kind: "domain" | "anchor"; value: string; note?: string }) =>
      addTrusted({ data: input }),
    onSuccess: () => {
      setValue("");
      setNote("");
      setFormError(null);
      invalidate();
    },
    onError: (error: unknown) =>
      setFormError(error instanceof Error ? error.message : "Couldn't save that entry."),
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => removeTrusted({ data: { id } }),
    onSuccess: invalidate,
  });
  const settingsMutation = useMutation({
    mutationFn: (input: { threshold: number; enabled: boolean; abuseThreshold: number; abuseEnabled: boolean }) => saveSettings({ data: input }),
    onSuccess: invalidate,
  });

  const settings = data?.settings ?? { threshold: 60, enabled: true, abuse_threshold: 60, abuse_enabled: true };
  const currentThreshold = threshold ?? settings.threshold;
  const currentAbuseThreshold = abuseThreshold ?? settings.abuse_threshold;
  const openAlerts = (data?.alerts ?? []).filter((a) => !a.acknowledged_at);
  const reviewedAlerts = (data?.alerts ?? []).filter((a) => a.acknowledged_at);

  return (
    <section aria-labelledby="backlink-alerts-heading" className="space-y-6">
      <div>
        <h2 id="backlink-alerts-heading" className="text-xl font-semibold tracking-tight">
          Risk alerts &amp; trusted sources
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every snapshot capture checks newly seen referring domains and anchor texts against the
          general spam and abuse thresholds below and files an alert for anything that crosses one. Trusted entries
          are skipped everywhere — no flag, no alert.
        </p>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading alerts…</p>
      ) : isError ? (
        <p className="text-sm text-destructive-strong">
          Couldn't load alerts — admin access is required.
        </p>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BellRing className="h-4 w-4" aria-hidden="true" />
               Alert thresholds
            </h3>
            <div className="mt-4 flex flex-wrap items-end gap-6">
              <div>
                <label
                  htmlFor="alert-threshold"
                  className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  General spam score
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="alert-threshold"
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={currentThreshold}
                    onChange={(event) => setThreshold(Number(event.target.value))}
                    className="w-48"
                  />
                  <span className="text-lg font-semibold tabular-nums">{currentThreshold}</span>
                </div>
              </div>
              <div>
                <label htmlFor="abuse-alert-threshold" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Abuse score
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input id="abuse-alert-threshold" type="range" min={20} max={100} step={5} value={currentAbuseThreshold} onChange={(event) => setAbuseThreshold(Number(event.target.value))} className="w-48" />
                  <span className="text-lg font-semibold tabular-nums">{currentAbuseThreshold}</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(event) =>
                    settingsMutation.mutate({
                      threshold: currentThreshold,
                      enabled: event.target.checked,
                      abuseThreshold: currentAbuseThreshold,
                      abuseEnabled: settings.abuse_enabled,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                Alerting on
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.abuse_enabled} onChange={(event) => settingsMutation.mutate({ threshold: currentThreshold, enabled: settings.enabled, abuseThreshold: currentAbuseThreshold, abuseEnabled: event.target.checked })} className="h-4 w-4 rounded border-input" />
                Abuse alerts on
              </label>
              <button
                type="button"
                onClick={() =>
                  settingsMutation.mutate({
                    threshold: currentThreshold,
                    enabled: settings.enabled,
                    abuseThreshold: currentAbuseThreshold,
                    abuseEnabled: settings.abuse_enabled,
                  })
                }
                disabled={settingsMutation.isPending || (currentThreshold === settings.threshold && currentAbuseThreshold === settings.abuse_threshold)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-60"
              >
                {settingsMutation.isPending ? "Saving…" : "Save threshold"}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              {settings.enabled
                ? `General alerts: ${settings.threshold}/100. Abuse alerts: ${settings.abuse_enabled ? `${settings.abuse_threshold}/100` : "muted"}.`
                : `General alerts are muted. Abuse alerts: ${settings.abuse_enabled ? `${settings.abuse_threshold}/100` : "muted"}.`}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center justify-between gap-2 text-sm font-semibold">
              <span>Open alerts</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  openAlerts.length
                    ? "bg-destructive/15 text-destructive-strong"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {openAlerts.length} needing review
              </span>
            </h3>
            {openAlerts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing over the threshold since the last capture.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {openAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium break-words">
                        {alert.kind === "anchor" ? `“${alert.value}”` : alert.value}{" "}
                        <span className={alert.category === "abuse" ? "rounded-full bg-destructive/15 px-2 py-0.5 text-xs text-destructive-strong" : "rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"}>
                          {alert.category === "abuse" ? "Abuse" : "Spam"}
                        </span>{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {alert.kind === "anchor" ? "anchor text" : "referring domain"} ·{" "}
                          {alert.score}/100 · {formatWhen(alert.created_at)}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            addMutation.mutate({ kind: alert.kind, value: alert.value })
                          }
                          disabled={addMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-60"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          Trust
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ackMutation.mutate({ id: alert.id, acknowledged: true })
                          }
                          disabled={ackMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-60"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Mark reviewed
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {alert.reasons.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {reviewedAlerts.length ? (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Reviewed alerts ({reviewedAlerts.length})
                </summary>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {reviewedAlerts.slice(0, 25).map((alert) => (
                    <li key={alert.id} className="flex flex-wrap items-baseline gap-2">
                      <span className="text-foreground break-words">{alert.value}</span>
                      <span>
                        {alert.score}/100 · reviewed {formatWhen(alert.acknowledged_at as string)}
                      </span>
                      <button
                        type="button"
                        onClick={() => ackMutation.mutate({ id: alert.id, acknowledged: false })}
                        className="underline hover:text-foreground"
                      >
                        Reopen
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Trusted domains &amp; anchors
            </h3>
            <form
              className="mt-4 flex flex-wrap items-end gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                addMutation.mutate({ kind, value, note });
              }}
            >
              <div>
                <label
                  htmlFor="trusted-kind"
                  className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Type
                </label>
                <select
                  id="trusted-kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value as "domain" | "anchor")}
                  className="mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="domain">Referring domain</option>
                  <option value="anchor">Anchor text</option>
                </select>
              </div>
              <div className="min-w-[14rem] flex-1">
                <label
                  htmlFor="trusted-value"
                  className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {kind === "domain" ? "Domain (subdomains included)" : "Exact anchor text"}
                </label>
                <input
                  id="trusted-value"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={kind === "domain" ? "dartmouth.edu" : "digital hygiene lessons"}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="min-w-[10rem] flex-1">
                <label
                  htmlFor="trusted-note"
                  className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Note (optional)
                </label>
                <input
                  id="trusted-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Partner site"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={addMutation.isPending || !value.trim()}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {addMutation.isPending ? "Adding…" : "Trust this"}
              </button>
            </form>
            {formError ? (
              <p className="mt-2 text-xs text-destructive-strong" aria-live="polite">
                {formError}
              </p>
            ) : null}

            {data?.trusted.length ? (
              <ul className="mt-4 space-y-2">
                {data.trusted.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm"
                  >
                    <span className="break-words">
                      <span className="font-medium">
                        {entry.kind === "anchor" ? `“${entry.value}”` : entry.value}
                      </span>{" "}
                      <span className="text-xs text-muted-foreground">
                        {entry.kind === "anchor" ? "anchor" : "domain"}
                        {entry.note ? ` · ${entry.note}` : ""}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(entry.id)}
                      disabled={removeMutation.isPending}
                      className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                      <span className="sr-only"> {entry.value} from the trusted list</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing trusted yet. Add your own site, partners, and university sources so their
                links never show up as risk.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
