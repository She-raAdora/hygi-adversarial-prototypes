import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, ShieldCheck } from "lucide-react";
import {
  SPLASH_ICONS,
  DEFAULT_HEADER_ICON,
  getStoredHeaderIcon,
  setStoredHeaderIcon,
  clearStoredHeaderIcon,
  iconPath,
  iconLabel,
} from "@/lib/headerIcon";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand Icon — Hygi — Learn Digital & Cyber Hygiene in Bite-Sized Lessons" },
      {
        name: "description",
        content:
          "Preview and choose the Hygi. splash icon used in the site header.",
      },
      { property: "og:title", content: "Brand Icon — Hygi — Learn Digital & Cyber Hygiene in Bite-Sized Lessons" },
      {
        property: "og:description",
        content:
          "Preview and choose the Hygi. splash icon used in the site header.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/brand" }],
  }),
  component: BrandPicker,
});

function BrandPicker() {
  const [selected, setSelected] = useState<string>(DEFAULT_HEADER_ICON);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSelected(getStoredHeaderIcon());
  }, []);

  function choose(filename: string) {
    setSelected(filename);
    setStoredHeaderIcon(filename);
  }

  function reset() {
    setSelected(DEFAULT_HEADER_ICON);
    clearStoredHeaderIcon();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Header icon picker</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Choose which splash image appears in the top-left header. The same icon is used on every page once you make a selection.
      </p>

      <div className="mt-8 flex items-center gap-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
          {isClient ? (
            <img
              src={iconPath(selected)}
              alt="Selected header icon"
              className="h-full w-full object-contain"
            />
          ) : (
            <ShieldCheck className="h-8 w-8 text-primary" />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">Current selection</p>
          <p className="text-sm text-muted-foreground">{iconLabel(selected)}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Reset to default
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-primary">All splash icons</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SPLASH_ICONS.map((filename) => {
            const active = selected === filename;
            return (
              <button
                key={filename}
                type="button"
                onClick={() => choose(filename)}
                className={`group relative flex flex-col items-center rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary"
                }`}
                aria-pressed={active}
              >
                <div className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  <img
                    src={iconPath(filename)}
                    alt={`Splash icon ${iconLabel(filename)}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                  {active && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <span className="mt-3 text-xs font-medium text-muted-foreground">{iconLabel(filename)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
