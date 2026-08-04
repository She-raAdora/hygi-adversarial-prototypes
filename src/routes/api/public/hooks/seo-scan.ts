import { createFileRoute } from "@tanstack/react-router";

/**
 * Weekly SEO health scan, called by the database scheduler.
 *
 * Public prefix, so the caller is verified here: the request must present a
 * dedicated server-only secret (SEO_SCAN_HOOK_SECRET) that is never shipped to
 * the browser. Returns only aggregate counts — no user data.
 */
export const Route = createFileRoute("/api/public/hooks/seo-scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided =
          request.headers.get("x-seo-scan-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";
        const expected = process.env["SEO_SCAN_HOOK_SECRET"] ?? "";

        if (!expected || provided.length !== expected.length || provided !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { runSeoAudit, recordSeoAudit } = await import("@/lib/seoAudit.server");
        const result = await recordSeoAudit(await runSeoAudit("https://digitalhygiene.app"));

        return Response.json({
          status: result.status,
          failing: result.failingCount,
          passing: result.passingCount,
          regressions: result.regressions.map((r) => r.id),
        });
      },
    },
  },
});