import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { readConsent, writeConsent, type ConsentState } from "@/lib/consent";

/**
 * One-time analytics opt-in. Renders nothing until hydration so the server and
 * client markup match, and nothing at all once a choice has been made.
 */
export function ConsentBanner() {
  const [state, setState] = useState<ConsentState | null>(null);

  useEffect(() => {
    setState(readConsent());
  }, []);

  if (state !== "unset") return null;

  function choose(next: "granted" | "denied") {
    writeConsent(next);
    setState(next);
  }

  return (
    <div
      role="region"
      aria-label="Analytics choice"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm"
    >
      <h2 className="text-sm font-semibold text-foreground">Help improve Hygi.?</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        We can send anonymous usage stats (pages opened, quizzes finished) to Google Analytics to
        see which lessons help most. Your quiz answers and badges always stay on your device. See
        the{" "}
        <Link to="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
