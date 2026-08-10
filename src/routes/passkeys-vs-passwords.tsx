import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { socialImageMeta } from "@/lib/seo";

const TITLE = "Passkeys vs. Passwords: Which Is Safer?";
const DESCRIPTION =
  "Passkeys vs. passwords, compared: how each works, why passkeys resist phishing, where passwords still apply, and how to switch your main accounts today.";
const URL = "https://digitalhygiene.app/passkeys-vs-passwords";

const comparison = [
  {
    aspect: "What you store",
    password: "A secret string you (or your password manager) must remember and type.",
    passkey:
      "A private key held by your device or password manager. Nothing memorable, nothing to type.",
  },
  {
    aspect: "What the site keeps",
    password: "A hash of your secret — still valuable to attackers if the database leaks.",
    passkey: "Only a public key, which is useless on its own if the database leaks.",
  },
  {
    aspect: "Phishing resistance",
    password: "Weak. A convincing fake login page captures it, MFA codes included.",
    passkey:
      "Strong. The passkey is bound to the real site's domain, so a look-alike page cannot use it.",
  },
  {
    aspect: "Reuse risk",
    password: "High. One reused password turns a single breach into many account takeovers.",
    passkey: "None. Every passkey is unique to one site and never leaves your authenticator.",
  },
  {
    aspect: "Day-to-day effort",
    password: "Type or autofill, then approve a second factor.",
    passkey: "Face, fingerprint, or device PIN. One step.",
  },
  {
    aspect: "Recovery",
    password: "Email reset link — which is why your email password matters most.",
    passkey:
      "Synced through your platform or password manager account; keep a backup method enabled.",
  },
];

const faq = [
  {
    q: "Are passkeys safer than passwords?",
    a: "Yes, for the threats most people actually face. A passkey is a private key that never leaves your device or password manager and is cryptographically tied to the real website's domain, so there is no secret to reuse, leak in a breach, or hand to a phishing page. Passwords can be guessed, reused, stolen from a breached database, or typed into a convincing fake login screen.",
  },
  {
    q: "What is a passkey, in plain language?",
    a: "A passkey replaces your password with a key pair. The site keeps the public half, your device keeps the private half, and signing in means your device proves it holds the private half after you unlock it with your face, fingerprint, or device PIN. You never see or type the key.",
  },
  {
    q: "Do passkeys replace multi-factor authentication?",
    a: "A passkey already combines something you have (the device holding the key) with something you are or know (biometric or PIN), so it covers what a password plus an app code was doing. Keep multi-factor authentication switched on for any account that still uses a password, and keep a backup sign-in method on passkey accounts.",
  },
  {
    q: "What happens if I lose my device?",
    a: "Passkeys created in Apple, Google, Microsoft, or a password manager account sync to your other signed-in devices, so a lost phone is not a lockout. Before you rely on passkeys, confirm sync is on, keep a second device or a recovery code, and make sure your email account itself is well protected.",
  },
  {
    q: "Should I still use a password manager?",
    a: "Yes. Passkey support is growing but far from universal, so you will keep passwords for years on smaller sites, older work systems, and legacy logins. A password manager stores both, generates long unique passwords where passkeys are unavailable, and can hold your passkeys too.",
  },
  {
    q: "Which accounts should I switch to passkeys first?",
    a: "Start with your email, because it can reset almost everything else. Then your password manager, cloud storage, financial accounts, and any account tied to your work or identity. Check each service's security settings for a passkeys or security keys option.",
  },
];

export const Route = createFileRoute("/passkeys-vs-passwords")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Passkeys vs. passwords: which is safer, and when to switch",
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "NorthBridge" },
        }),
      },
    ],
  }),
  component: PasskeysVsPasswordsPage,
});

function PasskeysVsPasswordsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Guide</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Passkeys vs. passwords: which is safer?
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A password is a secret you share with a website every time you sign in. A passkey is a key
        your device keeps and never shares. That single difference is why passkeys resist phishing
        and breaches in a way that even a long, unique password cannot.
      </p>

      <section aria-labelledby="how" className="mt-12">
        <h2 id="how" className="text-2xl font-semibold tracking-tight">
          How each one actually works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Passwords</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You send a shared secret to the site, which compares it against a stored hash.
              Anything that intercepts the secret — a fake login page, a keylogger, a leaked
              database, a reused password from another site — can sign in as you.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Passkeys</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your device generates a key pair per site. The site stores the public key; the private
              key stays in your device or password manager. Signing in means your device signs a
              one-time challenge after you unlock it with a biometric or PIN.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="table" className="mt-12">
        <h2 id="table" className="text-2xl font-semibold tracking-tight">
          Side-by-side comparison
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Passkeys compared with passwords</caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-medium">
                  Aspect
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Password
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Passkey
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.aspect} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-5 py-4 align-top font-semibold text-foreground">
                    {row.aspect}
                  </th>
                  <td className="px-5 py-4 align-top text-muted-foreground">{row.password}</td>
                  <td className="px-5 py-4 align-top text-muted-foreground">{row.passkey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="phishing" className="mt-12">
        <h2 id="phishing" className="text-2xl font-semibold tracking-tight">
          Why passkeys are phishing-resistant
        </h2>
        <p className="mt-3 text-muted-foreground">
          Phishing works because a password — and even a six-digit code from an authenticator app —
          is content you can be tricked into typing somewhere else. A passkey is bound to the exact
          domain it was created for. If you land on a look-alike page, your device simply has no
          passkey to offer, so there is nothing to steal and nothing to forward to the real site.
          That removes the most common way ordinary accounts are taken over, which is exactly the
          gap the accounts lesson in Hygi. focuses on.
        </p>
      </section>

      <section aria-labelledby="limits" className="mt-12">
        <h2 id="limits" className="text-2xl font-semibold tracking-tight">
          Where passwords still apply
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Sites and internal work systems that have not added passkey support yet.</li>
          <li>Shared or kiosk devices where you cannot enroll your own authenticator.</li>
          <li>
            Accounts where the recovery path still falls back to a password or an emailed reset
            link.
          </li>
          <li>
            Your password manager or device account itself, which is often the root of both systems
            — protect it with a long unique passphrase and multi-factor authentication.
          </li>
        </ul>
      </section>

      <section aria-labelledby="switch" className="mt-12">
        <h2 id="switch" className="text-2xl font-semibold tracking-tight">
          How to switch, in order
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Open your email account&rsquo;s security settings and add a passkey there first.</li>
          <li>
            Add a passkey to your password manager, cloud storage, and financial accounts next.
          </li>
          <li>Confirm passkey sync is enabled, or enroll a second device.</li>
          <li>Keep one backup sign-in method and store recovery codes somewhere offline.</li>
          <li>
            Leave multi-factor authentication switched on for every account that still uses a
            password.
          </li>
          <li>Keep the password manager — you will need it for everything not yet supported.</li>
        </ol>
      </section>

      <section aria-labelledby="faq-heading" className="mt-12">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <dl className="mt-6 space-y-6">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold tracking-tight">{f.q}</dt>
              <dd className="mt-1 text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="next" className="mt-14 rounded-3xl border border-border bg-card p-7">
        <h2 id="next" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
          Practice it in a short lesson
        </h2>
        <p className="mt-3 text-muted-foreground">
          The Protect your accounts lesson walks through passwords, passkeys, and multi-factor
          authentication, then ends in a mini-quiz and a badge.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/lesson/$id"
            params={{ id: "accounts" }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Protect your accounts
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/cyber-hygiene"
            className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            What is cyber hygiene?
          </Link>
        </div>
      </section>
    </main>
  );
}