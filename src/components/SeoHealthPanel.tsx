import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getSeoScanRuns, runSeoScanNow } from "@/lib/seo-monitor.functions";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Weekly SEO scan results with a regression alert. A regression is a check that
 * passed in the previous scan and fails in the latest one.
 */
export function SeoHealthPanel() {
  const queryClient = useQueryClient();
  const fetchRuns = useServerFn(getSeoScanRuns);
  const scanNow = useServerFn(runSeoScanNow);

  const { data: runs, isPending, isError } = useQuery({
    queryKey: ["seo-scan-runs"],
    queryFn: () => fetchRuns(),
    staleTime: 60_000,
  });

  const rescan = useMutation({
    mutationFn: () => scanNow(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-scan-runs"] }),
  });

  const latest = runs?.[0];
  const regressions = latest?.regressions ?? [];
  const failing = (latest?.checks ?? []).filter((c) => c.status === "failing");

  return (
    <section aria-labelledby="seo-health-heading" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="seo-health-heading" className="text-xl font-semibold tracking-tight">
          SEO health
        </h2>
        <button
          type="button"
          onClick={() => rescan.mutate()}
          disabled={rescan.isPending}
          className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          {rescan.isPending ? "Scanning…" : "Scan now"}
        </button>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Automated scan of the live site every Monday: robots.txt, sitemap coverage, and the head
        metadata of every key page. Checks that were passing last week and fail now show as
        regressions.
      </p>

      <div aria-live="polite" className="mt-5">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading scan history…</p>
        ) : isError ? (
          <p className="text-sm text-destructive-strong">Couldn't load SEO scan history.</p>
        ) : !latest ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
            No scan has run yet. The weekly job records its first result on the next run, or use
            “Scan now”.
          </p>
        ) : (
          <>
            {regressions.length > 0 ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5"
              >
                <p className="text-sm font-semibold text-foreground">
                  {regressions.length} check{regressions.length === 1 ? "" : "s"} regressed to
                  failing
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {regressions.map((r) => (
                    <li key={r.id}>
                      <span className="font-medium text-foreground">{r.label}</span> — {r.detail}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-sm font-semibold text-foreground">
                  No regressions since the previous scan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Last scan {formatWhen(latest.ran_at)} — {latest.passing_count} passing,{" "}
                  {latest.failing_count} failing.
                </p>
              </div>
            )}

            {failing.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Currently failing ({failing.length})
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {failing.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium text-foreground">{c.label}</span> — {c.detail}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {runs && runs.length > 1 ? (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60 bg-card">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Recent weekly SEO scans</caption>
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                      <th scope="col" className="px-5 py-3 font-medium">
                        Scan
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Passing
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Failing
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Regressions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run) => (
                      <tr key={run.id} className="border-b border-border/40 last:border-0">
                        <td className="px-5 py-3 text-muted-foreground">
                          {formatWhen(run.ran_at)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={
                              run.status === "passing"
                                ? "rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
                                : "rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive-strong"
                            }
                          >
                            {run.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 tabular-nums text-muted-foreground">
                          {run.passing_count}
                        </td>
                        <td className="px-5 py-3 tabular-nums text-muted-foreground">
                          {run.failing_count}
                        </td>
                        <td className="px-5 py-3 tabular-nums text-muted-foreground">
                          {run.regressions?.length ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}