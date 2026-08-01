import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface SeoScanRun {
  id: string;
  ran_at: string;
  status: string;
  failing_count: number;
  passing_count: number;
  checks: { id: string; label: string; status: string; detail: string }[];
  regressions: { id: string; label: string; status: string; detail: string }[];
}

/** Admin-only: the most recent weekly SEO scans, newest first. */
export const getSeoScanRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("seo_scan_runs")
      .select("id, ran_at, status, failing_count, passing_count, checks, regressions")
      .order("ran_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data ?? []) as unknown as SeoScanRun[];
  });

/** Admin-only: run the audit immediately instead of waiting for the weekly job. */
export const runSeoScanNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("current_user_has_role", {
      _role: "admin",
    });
    if (error) throw error;
    if (isAdmin !== true) throw new Response("Forbidden", { status: 403 });

    const { runSeoAudit, recordSeoAudit } = await import("@/lib/seoAudit.server");
    const result = await recordSeoAudit(await runSeoAudit("https://digitalhygiene.app"));
    return {
      status: result.status,
      failingCount: result.failingCount,
      passingCount: result.passingCount,
      regressions: result.regressions.map((r) => r.label),
    };
  });