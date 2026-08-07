import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, CheckCircle, Settings, Keyboard, Mail, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement — Hygi" },
      {
        name: "description",
        content:
          "How Hygi supports keyboard, screen reader, and low-vision access across lessons and quizzes, and how to report an accessibility issue.",
      },
      { property: "og:title", content: "Accessibility Statement — Hygi" },
      {
        property: "og:description",
        content:
          "How Hygi supports keyboard, screen reader, and low-vision access across lessons and quizzes, and how to report an accessibility issue.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/accessibility" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Accessibility Statement — Hygi" },
      {
        name: "twitter:description",
        content:
          "How Hygi supports keyboard, screen reader, and low-vision access across lessons and quizzes, and how to report an accessibility issue.",
      },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/accessibility" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Accessibility Statement — Hygi",
          description:
            "How Hygi supports keyboard, screen reader, and low-vision access across lessons and quizzes, and how to report an accessibility issue.",
          url: "https://digitalhygiene.app/accessibility",
          inLanguage: "en",
          dateModified: "2026-08-01",
          isPartOf: { "@type": "WebSite", name: "Hygi", url: "https://digitalhygiene.app" },
          publisher: { "@type": "Organization", name: "NorthBridge" },
        }),
      },
    ],
  }),
  component: AccessibilityPage,
});

const LAST_UPDATED = "August 1, 2026";

function AccessibilityPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <Eye className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Accessibility Statement</h1>
          <p className="text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
        </div>
      </div>

      <p className="mt-8 rounded-2xl border border-border/60 bg-secondary/50 p-5 text-sm leading-relaxed">
        Short version: Hygi. is designed to be usable by as many people as possible, including people
        who use screen readers, keyboard navigation, or other assistive technologies. We aim to follow
        WCAG 2.2 Level AA guidelines and welcome feedback if you run into a barrier.
      </p>

      <Section icon={<CheckCircle className="h-4 w-4" />} title="Our commitment">
        <p>
          We believe digital hygiene education should be accessible to everyone. Hygi. is built with
          semantic HTML, keyboard-friendly interactive elements, responsive layouts, and clear color
          contrast. We regularly review the app for accessibility improvements.
        </p>
      </Section>

      <Section icon={<Keyboard className="h-4 w-4" />} title="Keyboard navigation">
        <p>
          All core features — starting lessons, answering quiz questions, viewing badges, and moving
          between pages — can be used with a keyboard alone. Focus indicators are visible on buttons,
          links, and interactive controls so you can always see where you are.
        </p>
      </Section>

      <Section icon={<Eye className="h-4 w-4" />} title="Screen reader support">
        <p>
          The app uses semantic headings, landmarks, and labels so screen readers can describe pages
          accurately. Buttons and links have meaningful text, and icon-only controls include accessible
          labels. Quiz questions are grouped with clear labels so choices are easy to understand.
        </p>
      </Section>

      <Section icon={<Settings className="h-4 w-4" />} title="Browser and assistive technology support">
        <p>
          Hygi. works with modern browsers and assistive technologies. We recommend keeping your browser,
          screen reader, and operating system up to date for the best experience.
        </p>
      </Section>

      <Section icon={<AlertCircle className="h-4 w-4" />} title="Known limitations">
        <p>
          Some content links to external PDFs and third-party websites from our educational sources.
          We cannot guarantee the accessibility of those external resources. If you find an issue
          within Hygi. itself, please let us know.
        </p>
      </Section>

      <Section icon={<CheckCircle className="h-4 w-4" />} title="Standards we follow">
        <p>
          We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standard. This
          includes requirements for text contrast, keyboard access, resizable text, predictable
          navigation, and accessible error identification.
        </p>
      </Section>

      <Section icon={<Mail className="h-4 w-4" />} title="Feedback and contact">
        <p>
          If you encounter an accessibility barrier or have suggestions, contact NorthBridge at{" "}
          <a href="mailto:builtstrong1@outlook.com" className="text-primary underline underline-offset-2">
            builtstrong1@outlook.com
          </a>
          . We will review your message and work to make the experience better.
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
