import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, Inbox, ScanSearch, Settings, ShieldCheck, Users } from "lucide-react";

import { getSiteStats } from "@/lib/dashboard.functions";
import { lessons } from "@/lib/lessons";
import { LessonMetricsPanel } from "@/components/LessonMetricsPanel";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Hygi." },
      {
        name: "description",
        content:
          "Admin overview for Hygi.: contact requests, latest SEO scan health, curriculum size, and quick links to analytics and access management.",
      },
      { property: "og:title", content: "Admin Dashboard — Hygi." },
      {
        property: "og:description",
        content: "Site stats and quick links for Hygi. administrators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const quickLinks = [
  { to: "/insights", label: "Analytics & SEO health", icon: BarChart3 },
  { to: "/admin", label: "Manage admin access", icon: Users },
  { to: "/settings", label: "Email preferences", icon: Settings },
  { to: "/lessons", label: "View the curriculum", icon: ShieldCheck },
] as const;

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function DashboardPage() {
  const fetchStats = useServerFn(getSiteStats);
  const { data, isPending, isError } = useQuery({
    queryKey: ["site-stats"],
    queryFn: () => fetchStats(),
    staleTime: 60_000,
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {data?.email ? `Signed in as ${data.email}. ` : ""}A quick read on the site plus shortcuts to
        the admin tools.
      </p>

      {isPending ? (
        <p className="mt-10 text-sm text-muted-foreground" aria-live="polite">
          Loading site stats…
        </p>
      ) : isError ? (
        <p className="mt-10 text-sm text-destructive">
          Couldn't load site stats — admin access is required to view them.
        </p>
      ) : !data.allowed ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            This account doesn't have admin access yet. If no administrator exists, you can claim
            the first admin seat.
          </p>
          <Link
            to="/admin"
            className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to admin access
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Contact requests"
            value={String(data.contactRequests)}
            hint={`${data.contactRequestsLast7Days} in the last 7 days`}
          />
          <Stat label="Lessons live" value={String(lessons.length)} hint="Each with a pop quiz" />
          <Stat
            label="Quiz questions"
            value={String(lessons.reduce((n, l) => n + l.quiz.length, 0))}
            hint="Across the curriculum"
          />
          <Stat
            label="Latest SEO scan"
            value={
              data.latestScan ? `${data.latestScan.failingCount} failing` : "No scans yet"
            }
            hint={
              data.latestScan
                ? `${data.latestScan.passingCount} passing — ${new Date(
                    data.latestScan.ranAt,
                  ).toLocaleDateString()}`
                : "Weekly scan runs automatically"
            }
          />
        </div>
      )}

      <h2 className="mt-14 text-xl font-semibold tracking-tight">Lesson metrics</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Anonymous, aggregate activity from every visitor who opted in to analytics.
      </p>
      <div className="mt-4">
        <LessonMetricsPanel />
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">Quick links</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {quickLinks.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "var(--gradient-soft)" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 flex items-center gap-2 text-xs text-muted-foreground">
        <ScanSearch className="h-3.5 w-3.5" aria-hidden="true" />
        Learner progress is stored on each device, so per-user quiz data isn't visible here.
        <Inbox className="sr-only" aria-hidden="true" />
      </p>
    </main>
  );
}