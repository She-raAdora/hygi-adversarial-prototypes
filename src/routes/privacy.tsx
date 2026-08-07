import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Database, Server, Trash2, Mail, Bot, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hygi" },
      {
        name: "description",
        content:
          "How Hygi handles your data: progress and badges stay on your device, usage is measured anonymously, and no learner account is required.",
      },
      { property: "og:title", content: "Privacy Policy — Hygi" },
      {
        property: "og:description",
        content:
          "How Hygi handles your data: progress and badges stay on your device, usage is measured anonymously, and no learner account is required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/privacy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — Hygi" },
      {
        name: "twitter:description",
        content:
          "How Hygi handles your data: progress and badges stay on your device, usage is measured anonymously, and no learner account is required.",
      },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/privacy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy — Hygi",
          description:
            "How Hygi handles your data: progress and badges stay on your device, usage is measured anonymously, and no learner account is required.",
          url: "https://digitalhygiene.app/privacy",
          inLanguage: "en",
          dateModified: "2026-08-07",
          isPartOf: { "@type": "WebSite", name: "Hygi", url: "https://digitalhygiene.app" },
          publisher: { "@type": "Organization", name: "NorthBridge" },
        }),
      },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "August 7, 2026";

function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
        </div>
      </div>

      <p className="mt-8 rounded-2xl border border-border/60 bg-secondary/50 p-5 text-sm leading-relaxed">
        Short version: Hygi. is a free learning app — no learner account, no sign-in, and no ads.
        Your lesson progress and badges are saved only on your device. We do collect
        anonymous, opt-in usage stats to see which lessons help most, and staff accounts (for the
        admin dashboard) store an email address and role. We never sell data or build advertising
        profiles.
      </p>

      <Section icon={<Database className="h-4 w-4" />} title="Information we collect">
        <p>
          <strong className="font-medium text-foreground">Learners — no personal data required.</strong>{" "}
          Hygi. does not ask for your name, email, phone number, contacts, photos, location, health
          data, or payment details. There is no learner account to create.
        </p>
        <p>
          The learning data Hygi. stores is your progress — which lessons you have finished, quiz
          scores, badges, and the trophy. This is written to your device's local storage. It is not
          transmitted to us, it is
          not linked to your identity, and we cannot read it.
        </p>
        <p>
          Hygi. also keeps a copy of anonymous usage events (quiz starts and completions, badge
          milestones, home-screen install signals, and which glossary terms you tap) in the same
          on-device storage so the in-app{" "}
          <strong className="font-medium text-foreground">Insights</strong> dashboard can show you
          your activity. That log stays on your device and the "Clear this device's data" button on
          the Insights page erases it.
        </p>
        <p>
          Separately, we collect anonymous product analytics so we can tell whether the lessons are
          working: page views, quiz starts and completions (lesson title, score out of total, and
          pass/fail), badge and trophy milestones, whether the app was launched from a home screen, and
          which homepage CTA variant you saw. These events carry no name, email, account, quiz answer
          text, or precise location. Analytics only runs after you tap "Allow analytics".
        </p>
        <p>
          With your consent, we also collect anonymous lesson metrics in the backend to improve the
          course: which quiz questions are missed most, which glossary terms people tap, how many
          result-card images are shared or downloaded (and from which lesson or screen), and how many
          trophies are earned. Sharing a result card is optional and never required to open a lesson.
          Hygi. has no referral or invite programme: we do not read your contacts, we do not know who
          you shared with, and we never receive the recipient's details — only an anonymous count of
          the share action. These rows are stored in our database but contain no account ID, name,
          email, or anything else that could identify you.
        </p>
      </Section>

      <Section icon={<Bot className="h-4 w-4" />} title="Help chat">
        <p>
          The floating Hygi Helper chat lets you ask questions about the course, glossary, and the
          cyber hygiene guide. Your conversation history is stored only in your browser's local
          storage; we do not keep it on our servers. When you send a message, it is passed to our AI
          gateway (Google Gemini via Lovable AI Gateway) to generate a response. Do not include
          passwords, account numbers, or other personal information in your messages. You can clear
          the chat history at any time by pressing the "Start a new conversation" button in the chat
          panel.
        </p>
      </Section>

      <Section icon={<Server className="h-4 w-4" />} title="Third parties and tracking">
        <p>
          Hygi. contains no advertising SDKs and no cross-app or cross-site tracking, and we do not
          sell data or build advertising profiles. Services we use:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Google Analytics 4</strong> — anonymous
            product analytics only after you opt in. Google's handling of that data is governed by the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Google Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="font-medium text-foreground">Cloudflare Turnstile</strong> — an
            invisible CAPTCHA used on sign-in, support, and account-deletion forms to keep bots out.
            It may collect a token and basic technical signals to verify the request is from a human.
          </li>
          <li>
            <strong className="font-medium text-foreground">Lovable AI Gateway / Google Gemini</strong>{" "}
            — powers the help chat. Chat messages are sent to generate replies but are not stored on
            our servers.
          </li>
          <li>
            <strong className="font-medium text-foreground">Sign-in with Apple or Google</strong> —
            offered only to staff who need the admin and Insights pages. It is never required to read
            lessons, take quizzes, or earn badges, and we receive nothing from those providers beyond
            the email address tied to the account.
          </li>
        </ul>
        <p>
          Lesson pages link out to public cybersecurity guides published by Dartmouth, Caltech, Cal
          Poly, Harvard T.H. Chan School of Public Health, and CISA. If you follow one of those links,
          that organization's own privacy practices apply. Our hosting provider may keep standard,
          short-lived server logs (such as IP address and requested page) for security and
          reliability; these are not used to build a profile of you.
        </p>
      </Section>

      <Section icon={<BarChart3 className="h-4 w-4" />} title="A/B testing">
        <p>
          The homepage may show different wording or placement for the "Start Learning" button so we
          can learn which version helps more people begin a lesson. We assign a random variant when you
          first visit and stamp it on anonymous analytics events. The variant ID is not linked to any
          personal information.
        </p>
      </Section>

      <Section icon={<Trash2 className="h-4 w-4" />} title="Your control and data deletion">
        <p>
          Because your progress lives only on your device, you are always in control. You can erase
          everything at any time by clearing site data for Hygi. in your browser or device settings,
          using "Reset progress" on the{" "}
          <Link to="/support" className="text-primary underline underline-offset-2">
            Support page
          </Link>
          , or by deleting the app from your home screen. That clears lessons, quizzes, badges, the
          trophy, and the on-device event log.
        </p>
        <p>
          If you hold a staff account, you can permanently delete it — along with your email
          preferences and any admin role — from Account settings inside the app. Deletion is
          immediate and cannot be undone. You can also email builtstrong1@outlook.com to request
          deletion.
        </p>
        <p>
          You can turn analytics off at any time from the{" "}
          <Link to="/support" className="text-primary underline underline-offset-2">
            Support page
          </Link>
          , or block it with your browser's tracking protection or a content blocker. Turning analytics
          off stops new anonymous events from being sent; it does not delete your on-device learning
          progress.
        </p>
      </Section>

      <Section icon={<ShieldCheck className="h-4 w-4" />} title="Children's privacy">
        <p>
          Hygi. is an educational app suitable for general audiences. It does not knowingly collect
          personal information from anyone, including children under 13, and it contains no ads, in-app
          purchases, or user-to-user communication.
        </p>
      </Section>

      <Section icon={<Database className="h-4 w-4" />} title="App Store privacy disclosures">
        <p>
          These are the answers that apply to Hygi. for the Apple App Store privacy ("nutrition
          label") questionnaire and the Google Play Data safety form:
        </p>
        <ul className="mt-3 space-y-2">
          {disclosures.map((d) => (
            <li
              key={d.q}
              className="rounded-xl border border-border/60 bg-card p-3 text-sm"
            >
              <span className="font-medium text-foreground">{d.q}</span>
              <span className="mt-1 block text-muted-foreground">{d.a}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Mail className="h-4 w-4" />} title="Changes and contact">
        <p>
          If this policy changes, we will update the date at the top of this page. Questions about
          privacy in Hygi. can be sent to the app's publisher, NorthBridge, at{" "}
          <a href="mailto:builtstrong1@outlook.com" className="text-primary underline underline-offset-2">
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

const disclosures: { q: string; a: string }[] = [
  {
    q: "Data used to track you",
    a: "None. Hygi. does not track users across apps or websites and includes no advertising or attribution SDKs. Analytics data is not shared with data brokers or used for advertising.",
  },
  {
    q: "Data linked to you",
    a: "Email address, and only for optional staff accounts used to reach the admin and Insights pages. Learners never need an account, and no learning activity is linked to an identity. Staff can delete their account and email in-app at any time.",
  },
  {
    q: "Data not linked to you",
    a: "Product interaction and usage data: page views, quiz starts/completions with score, badge and trophy milestones, home-screen install events, glossary taps, missed quiz questions, optional result-card shares or downloads (an anonymous count only, with no recipient data), and homepage A/B variant. Collected anonymously via Google Analytics or stored in aggregate backend metrics only after the user opts in, and not linked to any identity. Your saved progress, badges, and chat history remain in on-device storage only.",
  },
  {
    q: "Contact info, identifiers, location, health, financials, contacts, photos, browsing history",
    a: "Only an email address for optional staff sign-in (Apple, Google, or email/password). No location, health, financial, contacts, photo, or browsing-history data is collected. CAPTCHA tokens are processed by Cloudflare Turnstile only when a form is submitted.",
  },
  {
    q: "Usage data / diagnostics / crash data",
    a: "Product interaction (usage) data is collected anonymously for analytics, only with consent. No crash-reporting SDK is present and no other diagnostics are collected.",
  },
  {
    q: "Data encryption in transit",
    a: "Yes. The app is served over HTTPS/TLS and all third-party API calls (analytics, CAPTCHA, AI gateway) use encrypted connections.",
  },
  {
    q: "Data deletion request method",
    a: "In-app: staff accounts are deleted from Account settings (Delete account), which removes the auth user, email preferences, and roles immediately. Learners clear on-device data with Reset progress on the Support page, by clearing site data, or by removing the app. Anonymous analytics and lesson-metric events cannot be tied to an individual; requests can also be sent to builtstrong1@outlook.com.",
  },
  {
    q: "Account creation, third-party login, ads, in-app purchases, user-generated content",
    a: "Accounts exist only for optional staff sign-in. No ads, no in-app purchases, and no user-generated content. Chat messages are processed by an AI assistant but are not stored on our servers or shared.",
  },
  {
    q: "Age rating / audience",
    a: "Suitable for all ages (4+). No objectionable content, no communication features.",
  },
];

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
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
