import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Admin-only site stats for the dashboard overview. */
export const getSiteStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc(
      "current_user_has_role",
      { _role: "admin" },
    );
    if (roleError) throw roleError;
    if (isAdmin !== true) throw new Error("Forbidden");

    const [requests, recentRequests, scans] = await Promise.all([
      context.supabase.from("contact_requests").select("id", { count: "exact", head: true }),
      context.supabase
        .from("contact_requests")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 864e5).toISOString()),
      context.supabase
        .from("seo_scan_runs")
        .select("ran_at, status, failing_count, passing_count")
        .order("ran_at", { ascending: false })
        .limit(1),
    ]);

    const latestScan = scans.data?.[0] ?? null;
    return {
      email: (context.claims["email"] as string | undefined) ?? null,
      contactRequests: requests.count ?? 0,
      contactRequestsLast7Days: recentRequests.count ?? 0,
      latestScan: latestScan
        ? {
            ranAt: latestScan.ran_at,
            status: latestScan.status,
            failingCount: latestScan.failing_count,
            passingCount: latestScan.passing_count,
          }
        : null,
    };
  });
