import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle, AlertCircle, Ban, Mail } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Hygi" },
      {
        name: "description",
        content:
          "Terms of Service for Hygi: how you may use the app, what you can expect from us, and what is not allowed.",
      },
      { property: "og:title", content: "Terms of Service — Hygi" },
      {
        property: "og:description",
        content:
          "Terms of Service for Hygi: how you may use the app, what you can expect from us, and what is not allowed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/terms" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Terms of Service — Hygi" },
      {
        name: "twitter:description",
        content:
          "Terms of Service for Hygi: how you may use the app, what you can expect from us, and what is not allowed.",
      },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/terms" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Service — Hygi",
          description:
            "Terms of Service for Hygi: how you may use the app, what you can expect from us, and what is not allowed.",
          url: "https://digitalhygiene.app/terms",
          inLanguage: "en",
          dateModified: "2026-08-01",
          isPartOf: { "@type": "WebSite", name: "Hygi", url: "https://digitalhygiene.app" },
          publisher: { "@type": "Organization", name: "NorthBridge" },
        }),
      },
    ],
  }),
  component: TermsPage,
});

const LAST_UPDATED = "August 1, 2026";

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <FileText className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
        </div>
      </div>

      <p className="mt-8 rounded-2xl border border-border/60 bg-secondary/50 p-5 text-sm leading-relaxed">
        Short version: Hygi. is an educational app for learning digital hygiene. Use it for personal,
        non-commercial learning. Don't misuse the content, don't attempt to interfere with the app,
        and understand that the lessons are informational, not legal or professional security advice.
      </p>

      <Section icon={<CheckCircle className="h-4 w-4" />} title="Acceptance of terms">
        <p>
          By using Hygi., you agree to these Terms of Service. If you do not agree, please do not use
          the app. These terms apply to all visitors, users, and learners who access the app on the web
          or through a mobile shortcut.
        </p>
      </Section>

      <Section icon={<CheckCircle className="h-4 w-4" />} title="Permitted use">
        <p>
          You may use Hygi. to learn about digital hygiene and cybersecurity best practices, complete
          quizzes, and earn badges for your own personal growth. You may share links to the app and
          encourage others to use it for educational purposes.
        </p>
      </Section>

      <Section icon={<Ban className="h-4 w-4" />} title="Prohibited use">
        <p>The following are not allowed when using Hygi.:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Using the app for any illegal, harmful, or fraudulent purpose.</li>
          <li>Attempting to disrupt, damage, or gain unauthorized access to the app or its infrastructure.</li>
          <li>Scraping, copying, or redistributing the lesson content or quiz materials for commercial purposes without permission.</li>
          <li>Impersonating the app, its publisher, or its sources.</li>
        </ul>
      </Section>

      <Section icon={<AlertCircle className="h-4 w-4" />} title="Educational purpose only">
        <p>
          The lessons and quizzes in Hygi. are for educational and awareness purposes. They are based
          on publicly available cybersecurity guidance, but they are not a substitute for professional
          security, legal, or compliance advice. Always follow your own organization’s policies and
          consult an expert when making security decisions.
        </p>
      </Section>

      <Section icon={<CheckCircle className="h-4 w-4" />} title="Intellectual property">
        <p>
          The app, its design, quizzes, and curated lesson content are the property of NorthBridge or
          used under appropriate licenses. The educational source materials are credited to their
          original authors (Dartmouth, Caltech, Cal Poly, and Harvard T.H. Chan School of Public Health).
          You may not reproduce, sell, or create derivative works from the app content without written
          permission.
        </p>
      </Section>

      <Section icon={<AlertCircle className="h-4 w-4" />} title="Disclaimer of warranties">
        <p>
          Hygi. is provided "as is" without warranties of any kind. We do not guarantee that the app
          will always be available, error-free, or that following a lesson will prevent every security
          incident. Your use of the app is at your own risk.
        </p>
      </Section>

      <Section icon={<AlertCircle className="h-4 w-4" />} title="Limitation of liability">
        <p>
          To the extent permitted by law, NorthBridge and its contributors will not be liable for any
          indirect, incidental, or consequential damages arising from your use of or inability to use
          Hygi.
        </p>
      </Section>

      <Section icon={<Mail className="h-4 w-4" />} title="Changes and contact">
        <p>
          We may update these Terms of Service from time to time. The latest version will always be
          posted on this page with the updated date. If you have questions, contact NorthBridge at{" "}
          <a href="mailto:builtstrong1@outlook.com" className="text-primary hover:underline">
            builtstrong1@outlook.com
          </a>
          .
        </p>
      </Section>

      <div className="mt-12">
        <Link
          to="/lessons"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to lessons
        </Link>
      </div>
    </main>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
