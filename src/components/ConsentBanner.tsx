import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  onConsentBannerOpen,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * Cookie consent banner covering analytics and A/B testing. Renders nothing
 * until hydration so the server and client markup match, and nothing at all
 * once a choice has been made — unless the visitor re-opens it from the footer.
 */
export function ConsentBanner() {
  const [state, setState] = useState<ConsentState | null>(null);
  const [forcedOpen, setForcedOpen] = useState(false);

  useEffect(() => {
    setState(readConsent());
  }, []);

  useEffect(() => onConsentBannerOpen(() => setForcedOpen(true)), []);

  if (state === null) return null;
  if (state !== "unset" && !forcedOpen) return null;

  function choose(next: "granted" | "denied") {
    writeConsent(next);
    setState(next);
    setForcedOpen(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie and tracking choices"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm"
    >
      <h2 className="text-sm font-semibold text-foreground">Cookies &amp; tracking</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Hygi. only needs essential storage to remember your progress. With your OK, we also turn on
        analytics cookies (anonymous stats like pages opened and quizzes finished, sent to Google
        Analytics) and A/B testing, which measures which homepage wording works best. Your quiz
        answers and badges always stay on your device. See the{" "}
        <Link to="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        . You can change this any time from “Cookie settings” in the footer.
      </p>
      {state !== "unset" && (
        <p className="mt-2 text-xs font-medium text-foreground">
          Current choice: {state === "granted" ? "analytics & A/B testing on" : "essential only"}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
