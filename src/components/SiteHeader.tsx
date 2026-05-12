import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { lessons } from "@/lib/lessons";

export function SiteHeader() {
  const progress = useProgress();
  const earned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
          >
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>Hygi<span className="text-primary">.</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "rounded-full px-4 py-2 bg-secondary text-foreground" }}
          >
            Home
          </Link>
          <Link
            to="/lessons"
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-full px-4 py-2 bg-secondary text-foreground" }}
          >
            Lessons
          </Link>
          <Link
            to="/badges"
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-full px-4 py-2 bg-secondary text-foreground" }}
          >
            Badges
            <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
              {earned}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}