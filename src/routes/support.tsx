import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { readConsent, writeConsent, type ConsentState } from "@/lib/consent";
import { ContactRequestForm } from "@/components/ContactRequestForm";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Help — Hygi" },
      {
        name: "description",
        content:
          "Get help with Hygi: contact support, reset your lesson progress, control analytics, and find privacy and accessibility information.",
      },
      { property: "og:title", content: "Support & Help — Hygi" },
      {
        property: "og:description",
        content:
          "Get help with Hygi: contact support, reset your lesson progress, control analytics, and find privacy and accessibility information.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/support" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/support" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: SupportPage,
});

const FAQ = [
  {
    q: "Do I need an account to use Hygi.?",
    a: "No. All 22 lessons, quizzes, badges, and the trophy are free and open with no sign-in. Accounts exist only for staff who need the admin and Insights pages.",
  },
  {
    q: "Where is my progress stored?",
    a: "On your device, in your browser's local storage. It is never uploaded, so clearing your browser data or switching devices starts you fresh.",
  },
  {
    q: "How do I install Hygi. on my phone?",
    a: "In Safari on iOS, tap Share then Add to Home Screen. In Chrome on Android, open the browser menu and tap Install app or Add to Home screen.",
  },
  {
    q: "How do I reset my badges and start over?",
    a: "Use the Reset progress button below. It clears lesson completions, quiz scores, and badges on this device only.",
  },
  {
    q: "What if I don't know a word used in a lesson?",
    a: "Lessons are written in plain language, and unfamiliar terms are underlined so you can tap or hover for a definition without leaving the lesson. The full Digital Safety Glossary is linked in the footer, on every lesson page, and here in support.",
  },
];

function SupportPage() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  function clearProgress() {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("hygi-"))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      /* storage unavailable */
    }
    setReset(true);
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Questions, bug reports, accessibility feedback, or privacy requests — email{" "}
        <a
          href="mailto:builtstrong1@outlook.com"
          className="font-medium text-foreground underline underline-offset-4"
        >
          builtstrong1@outlook.com
        </a>
        . We aim to reply within three business days.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Common questions</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Unfamiliar word in a lesson? Tap the underlined term for a definition in place, or open the{" "}
          <Link to="/glossary" className="font-medium text-foreground underline underline-offset-4">
            Digital Safety Glossary
          </Link>
          .
        </p>
        <dl className="mt-4 space-y-5">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border border-border/60 bg-card p-5">
              <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ContactRequestForm
        kind="support"
        heading="Send us a message"
        intro="Prefer a form? Tell us what's going on and we'll reply to the address you give us, usually within three business days. A quick CAPTCHA keeps bots out."
        messageLabel="How can we help?"
        submitLabel="Send message"
        successText="Thanks — your message is in. We'll reply to the email you gave us."
      />

      <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="text-xl font-semibold">Your data on this device</h2>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground">Analytics</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {consent === "granted"
              ? "Anonymous usage stats are being shared with Google Analytics."
              : "No usage stats are being shared. Analytics is off on this device."}
          </p>
          <button
            type="button"
            onClick={() => {
              const next = consent === "granted" ? "denied" : "granted";
              writeConsent(next);
              setConsent(next);
            }}
            className="mt-3 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {consent === "granted" ? "Turn analytics off" : "Turn analytics on"}
          </button>
        </div>

        <div className="mt-6 border-t border-border/60 pt-6">
          <h3 className="text-sm font-semibold text-foreground">Reset progress</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Clears lesson completions, quiz scores, badges, and the trophy stored in this browser.
            This cannot be undone.
          </p>
          <button
            type="button"
            onClick={clearProgress}
            className="mt-3 rounded-full border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive-strong transition-colors hover:bg-destructive/10"
          >
            Reset progress
          </button>
          <p className="mt-2 text-sm text-primary" aria-live="polite">
            {reset ? "Progress cleared. Reload the page to start fresh." : ""}
          </p>
        </div>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        See also the{" "}
        <Link to="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        ,{" "}
        <Link to="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>
        , and{" "}
        <Link to="/accessibility" className="underline hover:text-foreground">
          Accessibility Statement
        </Link>
        . Signed-in staff can delete their account from{" "}
        <Link to="/settings" className="underline hover:text-foreground">
          account settings
        </Link>
        .
      </p>
    </main>
  );
}
