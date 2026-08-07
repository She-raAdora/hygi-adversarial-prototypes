import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { socialImageMeta } from "@/lib/seo";

const TITLE = "What Is Cyber Hygiene? A Practical Guide";
const DESCRIPTION =
  "Cyber hygiene is the small, repeatable habits that keep your accounts, devices, and data secure. Learn the core practices and a checklist for today.";
const URL = "https://digitalhygiene.app/cyber-hygiene";

const practices = [
  {
    name: "Use a password manager and unique passwords",
    detail:
      "Reused passwords turn one breach into many. A manager generates and remembers a long, unique password for every account so you only memorize one.",
  },
  {
    name: "Turn on multi-factor authentication",
    detail:
      "An app-based code or passkey stops most account takeovers even when your password leaks. Prioritize email, banking, and work accounts first.",
  },
  {
    name: "Patch quickly and automatically",
    detail:
      "Most successful attacks exploit a bug that already had a fix. Enable automatic updates for your operating system, browser, and apps.",
  },
  {
    name: "Slow down on links and attachments",
    detail:
      "Phishing — increasingly written with AI — is still the most common way in. Verify unexpected requests through a channel you already trust.",
  },
  {
    name: "Encrypt devices and lock screens",
    detail:
      "Full-disk encryption plus a strong passcode means a lost laptop or phone is an inconvenience, not a data breach.",
  },
  {
    name: "Back up on a schedule and test restores",
    detail:
      "Keep one backup offline or versioned. Ransomware only wins when the only copy of your data is the one it encrypted.",
  },
  {
    name: "Shrink what you expose",
    detail:
      "Audit old accounts, tighten social privacy settings, and remove data you no longer need. Less exposure means less to protect.",
  },
  {
    name: "Know how to report a problem",
    detail:
      "Decide in advance who you tell and how fast. Reporting early limits damage far more than trying to fix it quietly.",
  },
];

const faq = [
  {
    q: "What is cyber hygiene?",
    a: "Cyber hygiene is the routine set of security habits — unique passwords, multi-factor authentication, prompt updates, careful clicking, encryption, and backups — that people and organizations repeat to reduce the chance of a breach. Like brushing your teeth, the value comes from consistency rather than any single action.",
  },
  {
    q: "What is the difference between cyber hygiene and digital hygiene?",
    a: "Cyber hygiene focuses on security: keeping attackers out of your accounts, devices, and data. Digital hygiene is broader and also covers privacy, your online footprint, and how tidy and intentional your digital life is. In practice they overlap heavily — good cyber hygiene is the security half of good digital hygiene.",
  },
  {
    q: "Why is cyber hygiene important?",
    a: "The overwhelming majority of incidents start with an ordinary, preventable gap: a reused password, an unpatched device, a convincing phishing email. Basic hygiene removes the cheap paths in, which is why security teams at universities and companies teach it before anything advanced.",
  },
  {
    q: "How often should I review my cyber hygiene?",
    a: "Automate what you can — updates, backups, and password generation — then do a fifteen-minute review each quarter: check for breached passwords, remove unused accounts and app permissions, and confirm your backups actually restore.",
  },
  {
    q: "Where do I start if I have never thought about it?",
    a: "Start with a password manager and multi-factor authentication on your email account, because email resets everything else. Then work through the rest one habit at a time — Hygi. turns each of them into a short lesson with a quiz and a badge.",
  },
];

export const Route = createFileRoute("/cyber-hygiene")({
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
          headline: "What Is Cyber Hygiene? A Practical Guide",
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "NorthBridge" },
        }),
      },
    ],
  }),
  component: CyberHygienePage,
});

function CyberHygienePage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Guide</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">What is cyber hygiene?</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Cyber hygiene is the set of small, repeatable habits that keep your accounts, devices, and
        data out of the wrong hands. It is not a product you buy or a one-time cleanup — it is a
        routine, and the routine is what makes it work.
      </p>

      <section aria-labelledby="why" className="mt-12">
        <h2 id="why" className="text-2xl font-semibold tracking-tight">
          Why it matters more than advanced defenses
        </h2>
        <p className="mt-3 text-muted-foreground">
          Almost every incident that reaches a real person starts somewhere ordinary: a password
          reused from a breached site, a laptop two updates behind, a message that looked like it
          came from a colleague. Attackers prefer the cheap path. Cyber hygiene closes those cheap
          paths, which is why university and enterprise security programs teach it first — long
          before anyone talks about threat hunting or zero trust architecture.
        </p>
      </section>

      <section aria-labelledby="vs" className="mt-12">
        <h2 id="vs" className="text-2xl font-semibold tracking-tight">
          Cyber hygiene vs. digital hygiene
        </h2>
        <p className="mt-3 text-muted-foreground">
          The two terms are often used interchangeably, and the habits overlap almost completely.
          The useful distinction is one of scope.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Cyber hygiene</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Security-first. Keeping attackers, malware, and account takeovers out. Passwords,
              MFA, patching, encryption, backups, phishing awareness, incident reporting.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Digital hygiene</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Broader. Includes all of the above plus privacy and footprint: what you share, which
              old accounts still exist, what data brokers hold, and how intentional your digital
              life is.
            </p>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">
          Put simply: cyber hygiene is the security half of digital hygiene. If you are looking for
          &ldquo;security fundamentals,&rdquo; you want cyber hygiene. If you also care about how
          much of you is discoverable online, you want the wider practice — which is what Hygi.
          teaches.
        </p>
      </section>

      <section aria-labelledby="practices" className="mt-12">
        <h2 id="practices" className="text-2xl font-semibold tracking-tight">
          The eight core cyber hygiene practices
        </h2>
        <ul className="mt-6 space-y-4">
          {practices.map((p) => (
            <li key={p.name} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-strong" aria-hidden="true" />
              <div>
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="checklist" className="mt-12">
        <h2 id="checklist" className="text-2xl font-semibold tracking-tight">
          A cyber hygiene checklist you can finish this week
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Install a password manager and move your email password into it first.</li>
          <li>Turn on multi-factor authentication for email, banking, and work accounts.</li>
          <li>Enable automatic updates on every device you own.</li>
          <li>Confirm disk encryption and a screen lock on your laptop and phone.</li>
          <li>Set up one automatic backup, then restore a single file to prove it works.</li>
          <li>Delete or lock down five accounts you no longer use.</li>
          <li>Write down who you would report a suspected compromise to, and how.</li>
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
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          Turn the habits into practice
        </h2>
        <p className="mt-3 text-muted-foreground">
          Hygi. breaks these fundamentals into {lessons.length} short lessons, each ending in a pop
          quiz and a badge — built from Dartmouth, Caltech, Cal Poly, Harvard University&rsquo;s, and CISA&rsquo;s
          cybersecurity and digital safety guides.
        </p>
        <Link
          to="/lessons"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Browse the lessons
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
