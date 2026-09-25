import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Lock, ShieldCheck } from "lucide-react";

import { socialImageMeta } from "@/lib/seo";

type SecurityTerm = {
  id: string;
  term: string;
  aliases?: string[];
  meaning: string;
  practice: string;
  whyItMatters: string;
  whatToDo: string[];
  watchOut: string;
  relatedTerms: { label: string; href: string }[];
  relatedLessons: { label: string; to: string }[];
};

const TERMS: SecurityTerm[] = [
  {
    id: "passkeys",
    term: "Passkeys",
    aliases: ["passkey"],
    meaning:
      "A passkey is a phishing-resistant way to sign in. Instead of typing a reusable password, your device creates a unique cryptographic credential for each account and unlocks it with your fingerprint, face, or device PIN.",
    practice:
      "You tap “Sign in with a passkey,” your phone asks for Face ID, and you're in — nothing to type, nothing to leak. The secret never leaves your device; the site only ever sees proof that you hold it.",
    whyItMatters:
      "Passkeys can't be guessed, reused across sites, or typed into a fake login page. Modern guidance (including NIST SP 800-63B) treats them as the strongest everyday sign-in method available to most people.",
    whatToDo: [
      "Start with your email account — it controls password resets for everything else.",
      "Keep a device lock on every device that holds a passkey.",
      "Set up a backup sign-in method (a second device or a security key) before you need it.",
      "Say yes when an important account offers passkey sign-in; it replaces, not adds to, your password.",
    ],
    watchOut:
      "A passkey doesn't remove the need for recovery: if you lose every enrolled device, account recovery is your way back in. Check your recovery email and phone number are current.",
    relatedTerms: [
      { label: "FIDO", href: "/security-glossary#fido" },
      { label: "WebAuthn", href: "/glossary#webauthn" },
      { label: "Phishing-resistant authentication", href: "/glossary#phishing-resistant-authentication" },
      { label: "Account recovery", href: "/glossary#account-recovery" },
    ],
    relatedLessons: [
      { label: "Protect Your Accounts", to: "/lesson/accounts" },
      { label: "Passkeys vs. passwords guide", to: "/passkeys-vs-passwords" },
    ],
  },
  {
    id: "fido",
    term: "FIDO",
    aliases: ["FIDO2", "FIDO Alliance"],
    meaning:
      "FIDO is a family of open authentication standards — not a brand, app, or product — that defines how phishing-resistant sign-in methods like passkeys and security keys work.",
    practice:
      "When a website says “FIDO2 compatible” or “passkey supported,” it's speaking FIDO. The standard ties each credential to the exact website it was created for, so a lookalike site can't trick your device into handing it over.",
    whyItMatters:
      "FIDO credentials are bound to the real website's address. Even a pixel-perfect fake login page can't collect a usable FIDO credential, which is why these methods are called phishing-resistant.",
    whatToDo: [
      "Treat “FIDO”, “passkey”, or “security key” sign-in as an account's strongest option when it's offered.",
      "Keep your browser and phone updated so FIDO sign-in works reliably.",
      "For high-stakes accounts, a hardware security key is the most portable way to use FIDO.",
    ],
    watchOut:
      "FIDO is the plumbing behind passkeys. You'll rarely see the word day to day, but it's the reason passkeys and security keys resist phishing.",
    relatedTerms: [
      { label: "Passkeys", href: "/security-glossary#passkeys" },
      { label: "WebAuthn", href: "/glossary#webauthn" },
      { label: "Security key", href: "/glossary#security-key" },
    ],
    relatedLessons: [{ label: "Passkeys vs. passwords guide", to: "/passkeys-vs-passwords" }],
  },
  {
    id: "totp",
    term: "TOTP",
    aliases: ["Time-based one-time password", "authenticator app codes"],
    meaning:
      "TOTP is a temporary login code your authenticator app generates from a shared secret, refreshing about every thirty seconds. You type it in after your password as the second factor of sign-in.",
    practice:
      "When you turn on MFA, the site shows a setup key (often as a QR code) that you add to an authenticator app. From then on, the app shows a rolling six-digit code that works only for a short window.",
    whyItMatters:
      "TOTP is far better than a password alone and better than text-message codes, because it doesn't depend on your phone number. But it still has one weakness: it's a code you type, and codes you type can be typed into a fake page too.",
    whatToDo: [
      "Use an authenticator app instead of SMS codes where a site offers both.",
      "Prefer a passkey or security key over TOTP when an account offers one.",
      "Save the setup key in your password manager so you can move to a new phone.",
      "Store printed backup codes somewhere safe — they work like passwords.",
    ],
    watchOut:
      "A code typed by hand is not phishing-resistant: if you type a current code into a lookalike login page, an attacker can replay it immediately and get in.",
    relatedTerms: [
      { label: "MFA", href: "/security-glossary#mfa" },
      { label: "One-time password", href: "/glossary#one-time-password" },
      { label: "SIM swap", href: "/glossary#sim-swap" },
    ],
    relatedLessons: [{ label: "Lock Down Account Access", to: "/lesson/shield-accounts" }],
  },
  {
    id: "mfa",
    term: "MFA",
    aliases: ["multifactor authentication", "two-factor authentication", "2FA"],
    meaning:
      "MFA means signing in with more than one type of proof: something you know (a passphrase), something you have (a phone, app, or security key), or something you are (a fingerprint or face). One stolen proof isn't enough.",
    practice:
      "You enter your passphrase, then approve the sign-in on your phone or tap a security key. An attacker with only your password still can't get in.",
    whyItMatters:
      "Password leaks are routine — MFA is the layer that keeps a leaked password from becoming a broken-in account. All methods beat password-only, but they are not equal: passkeys and security keys resist phishing; typed codes don't.",
    whatToDo: [
      "Turn MFA on first for email, banking, and cloud storage.",
      "Pick the strongest option offered: passkey or security key, then authenticator app, then SMS.",
      "Save recovery codes when you first switch MFA on.",
      "Never approve an unexpected login prompt, and never read a login code to anyone who contacts you.",
    ],
    watchOut:
      "Unexpected MFA prompts usually mean someone already has your password. Deny the prompt, then change your password from a trusted device.",
    relatedTerms: [
      { label: "Passkeys", href: "/security-glossary#passkeys" },
      { label: "TOTP", href: "/security-glossary#totp" },
      { label: "MFA fatigue", href: "/glossary#mfa-fatigue" },
      { label: "Verification code", href: "/glossary#verification-code" },
    ],
    relatedLessons: [
      { label: "Protect Your Accounts", to: "/lesson/accounts" },
      { label: "Lock Down Account Access", to: "/lesson/shield-accounts" },
    ],
  },
  {
    id: "phishing",
    term: "Phishing",
    meaning:
      "Phishing is a deceptive message — email, text, chat, or even a phone call — designed to make you click, share information, send money, or hand over account access.",
    practice:
      "A message claims to be your bank, a delivery company, or a colleague, creates urgency (“your account will be closed today”), and sends you to a lookalike login page or an attachment. Newer variants use AI to write flawless copy, clone voices, and even abuse sign-in tools like device codes.",
    whyItMatters:
      "Phishing is the front door to most account takeovers. Technology can filter some of it, but the deciding factor is a person pausing before they act.",
    whatToDo: [
      "Don't tap links in unexpected messages — open the company's app or type its address yourself.",
      "Real companies never ask for your password or a login code by message or phone.",
      "Slow down on urgency and unusual requests; verify through a channel you choose.",
      "If you already typed your password on a suspicious page, change it immediately from a trusted device.",
    ],
    watchOut:
      "A familiar name, logo, or sender address proves nothing — all of it can be faked.",
    relatedTerms: [
      { label: "Smishing", href: "/glossary#smishing" },
      { label: "Credential stuffing", href: "/security-glossary#credential-stuffing" },
      { label: "Account takeover", href: "/security-glossary#account-takeover" },
    ],
    relatedLessons: [
      { label: "Safe Browsing & Scams", to: "/lesson/safe-browsing" },
      { label: "Stop Device-Code Phishing", to: "/lesson/device-code-phishing" },
      { label: "Spot AI Phishing", to: "/lesson/ai-phishing" },
      { label: "Run Phishing Simulations Safely", to: "/lesson/phishing-simulations-safely" },
    ],
  },
  {
    id: "credential-stuffing",
    term: "Credential stuffing",
    meaning:
      "Credential stuffing is an automated attack that takes username-and-password pairs leaked from one breach and tries them on hundreds of other websites, counting on people reusing passwords.",
    practice:
      "A forum you barely remember gets breached. Criminals feed those credentials into automation that tests them against banks, shops, and email providers — and every account that reused the same password opens.",
    whyItMatters:
      "It's why a breach at an unrelated site can break into your email years later. The attack needs no skill and no personal targeting — only one reused password.",
    whatToDo: [
      "Give every account its own unique password — length over complexity (a long passphrase is easiest).",
      "Use a password manager to generate and remember them.",
      "Check your email addresses at haveibeenpwned.com to see what's already leaked.",
      "Turn on MFA so a leaked password alone can't get in.",
    ],
    watchOut:
      "Adding a “1” or “!” to the end of a reused password doesn't make it a different password.",
    relatedTerms: [
      { label: "Password reuse", href: "/glossary#password-reuse" },
      { label: "Account takeover", href: "/security-glossary#account-takeover" },
      { label: "MFA", href: "/security-glossary#mfa" },
    ],
    relatedLessons: [{ label: "Protect Your Accounts", to: "/lesson/accounts" }],
  },
  {
    id: "account-takeover",
    term: "Account takeover",
    aliases: ["ATO"],
    meaning:
      "Account takeover is when someone other than the owner gains control of an account — usually through a stolen or reused password, a phished login code, or a SIM swap.",
    practice:
      "It often starts quietly: password-reset emails you didn't request, new forwarding rules, logins from another country, friends receiving strange messages “from you.” By the time you're locked out, the attacker may have changed recovery details.",
    whyItMatters:
      "A takeover is the end state of most of the attacks on this page. And your email account is the master key — whoever controls it can reset the passwords for almost everything else.",
    whatToDo: [
      "From a trusted device, change the password, sign out all sessions, and review connected apps.",
      "Check recovery email, phone number, and forwarding rules for changes.",
      "Turn on MFA — ideally a passkey or security key.",
      "Warn contacts if messages went out in your name, and report it to the service's support or security page.",
    ],
    watchOut:
      "Act on the early signs — unexpected reset codes or new logins — before recovery details are changed out from under you.",
    relatedTerms: [
      { label: "Compromised account", href: "/glossary#compromised-account" },
      { label: "Account recovery", href: "/glossary#account-recovery" },
      { label: "Credential stuffing", href: "/security-glossary#credential-stuffing" },
      { label: "SIM swap", href: "/glossary#sim-swap" },
    ],
    relatedLessons: [
      { label: "Lock Down Account Access", to: "/lesson/shield-accounts" },
      { label: "Protect Your Accounts", to: "/lesson/accounts" },
    ],
  },
];

export const Route = createFileRoute("/security-glossary")({
  head: () => ({
    meta: [
      { title: "Security Glossary — Hygi" },
      {
        name: "description",
        content:
          "Plain-language security definitions for passkeys, FIDO, TOTP, MFA, phishing, credential stuffing, and account takeover — what each one means and what to do.",
      },
      { property: "og:title", content: "Security Glossary — Hygi" },
      {
        property: "og:description",
        content:
          "Plain-language security definitions for passkeys, FIDO, TOTP, MFA, phishing, credential stuffing, and account takeover.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/security-glossary" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/security-glossary" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Hygi. Security Glossary",
          hasDefinedTerm: TERMS.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.meaning,
          })),
        }),
      },
    ],
  }),
  component: SecurityGlossaryPage,
});

function SecurityGlossaryPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-14">
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" /> 7 security terms
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Security Glossary</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The seven security words that matter most for keeping your accounts yours — passkeys, FIDO,
        TOTP, MFA, phishing, credential stuffing, and account takeover — explained in plain language,
        with what to actually do about each one.
      </p>

      <nav aria-label="Security terms" className="mt-8 flex flex-wrap gap-2">
        {TERMS.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.term}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-10">
        {TERMS.map((t, i) => (
          <section
            key={t.id}
            id={t.id}
            aria-labelledby={`${t.id}-heading`}
            className="scroll-mt-24 rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
          >
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="text-sm font-semibold tabular-nums text-muted-foreground/60"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 id={`${t.id}-heading`} className="text-xl font-semibold tracking-tight">
                {t.term}
              </h2>
              {t.aliases?.length ? (
                <span className="text-xs font-normal text-muted-foreground">
                  also: {t.aliases.join(", ")}
                </span>
              ) : null}
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-medium text-foreground">What it means</h3>
                <p className="mt-1 text-muted-foreground">{t.meaning}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">In practice</h3>
                <p className="mt-1 text-muted-foreground">{t.practice}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Why it matters</h3>
                <p className="mt-1 text-muted-foreground">{t.whyItMatters}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">What to do</h3>
                <ul className="mt-1.5 space-y-1.5 text-muted-foreground">
                  {t.whatToDo.map((d) => (
                    <li key={d} className="flex gap-2">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/50 p-4">
                <h3 className="font-medium text-foreground">Watch out</h3>
                <p className="mt-1 text-muted-foreground">{t.watchOut}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border/60 pt-4 text-xs">
              {t.relatedTerms.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
                >
                  {r.label}
                </a>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.relatedLessons.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Want every term?</h2>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This page covers the seven security essentials. The full glossary has all{" "}
          <Link to="/glossary" className="underline hover:text-foreground">
            80+ digital safety terms
          </Link>
          , searchable and grouped by topic.
        </p>
      </div>
    </main>
  );
}
