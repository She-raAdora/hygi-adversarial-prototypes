import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Database, Server, Trash2, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hygi. Digital Hygiene Lessons" },
      {
        name: "description",
        content:
          "How Hygi. handles your data: no accounts and no personal data. Progress and badges stay on your device; usage is measured anonymously.",
      },
      { property: "og:title", content: "Privacy Policy — Hygi." },
      {
        property: "og:description",
        content:
          "Hygi. collects no personal data. Progress and badges are stored locally on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — Hygi." },
      {
        name: "twitter:description",
        content:
          "Hygi. collects no personal data. Progress and badges are stored locally on your device.",
      },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "August 1, 2026";

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
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
        Short version: Hygi. has no accounts, no sign-in, and no ads. We do not collect, sell, or
        share personal information. Your lesson progress and badges are saved only in your own
        browser or device storage. We do measure anonymous, aggregate usage — such as which pages
        are viewed, how many quizzes are finished, and how often the app is added to a home screen
        — using Google Analytics.
      </p>

      <Section icon={<Database className="h-4 w-4" />} title="Information we collect">
        <p>
          <strong className="font-medium text-foreground">None that identifies you.</strong> Hygi.
          does not ask for your name, email address, phone number, contacts, photos, precise or
          coarse location, health data, or payment details. There is no account to create.
        </p>
        <p>
          The only data Hygi. stores is your learning progress — which lessons you have finished,
          your quiz scores, and which badges and the final trophy you have earned. This is written
          to your device's local storage on your device. It is not transmitted to us, it is not
          linked to your identity, and we cannot read it.
        </p>
        <p>
          Hygi. also keeps a copy of its own anonymous usage events (quiz starts and completions,
          badge milestones, and home-screen install signals) in that same on-device storage so the
          in-app <strong className="font-medium text-foreground">Insights</strong> dashboard can show
          you your activity. That log stays on your device, and the "Clear this device's data" button
          on the Insights page erases it.
        </p>
        <p>
          Separately, we collect anonymous product analytics so we can tell whether the lessons are
          working: page views, quiz starts and completions (lesson title, score out of total, and
          pass/fail), badge and trophy milestones, and whether the app was launched from a home
          screen. These events carry no name, email, account, quiz answer text, or precise location.
        </p>
      </Section>

      <Section icon={<Server className="h-4 w-4" />} title="Third parties and tracking">
        <p>
          Hygi. contains no advertising SDKs and no cross-app or cross-site tracking, and we do not
          sell data or build advertising profiles. We use one analytics provider, Google Analytics
          4, and it only loads after you tap "Allow analytics" — until then nothing is sent and no
          analytics cookies or identifiers are set. Once enabled it counts returning visits in
          aggregate; Google's handling of that data is governed by the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Google Privacy Policy
          </a>
          . You can turn analytics back off at any time from the{" "}
          <Link to="/support" className="text-primary hover:underline">
            Support page
          </Link>
          , or block it with your browser's tracking protection or a content blocker.
        </p>
        <p>
          Sign-in with Apple or Google is offered only to staff who need the admin and Insights
          pages. It is never required to read lessons, take quizzes, or earn badges, and we receive
          nothing from those providers beyond the email address tied to the account.
        </p>
        <p>
          Lesson pages link out to public cybersecurity guides published by Dartmouth, Caltech,
          Cal Poly, and Harvard T.H. Chan School of Public Health. If you follow one of those
          links, that organization's own privacy practices apply. Our hosting provider may keep
          standard, short-lived server logs (such as IP address and requested page) for security
          and reliability; these are not used to build a profile of you.
        </p>
      </Section>

      <Section icon={<Trash2 className="h-4 w-4" />} title="Your control and data deletion">
        <p>
          Because your progress lives only on your device, you are always in control. You can
          erase everything at any time by clearing site data for Hygi. in your browser or device
          settings, using "Reset progress" on the{" "}
          <Link to="/support" className="text-primary hover:underline">
            Support page
          </Link>
          , or by deleting the app from your home screen.
        </p>
        <p>
          If you hold a staff account, you can permanently delete it — along with your email
          preferences and any admin role — from Account settings inside the app. Deletion is
          immediate and cannot be undone. You can also email builtstrong1@outlook.com to request
          deletion.
        </p>
      </Section>

      <Section icon={<ShieldCheck className="h-4 w-4" />} title="Children's privacy">
        <p>
          Hygi. is an educational app suitable for general audiences. It does not knowingly
          collect personal information from anyone, including children under 13, and it contains
          no ads, in-app purchases, or user-to-user communication.
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
    a: "Product interaction and diagnostic-free usage data: page views, quiz starts/completions with score, badge and trophy milestones, and home-screen install events. Collected anonymously via Google Analytics only after the user opts in, and not linked to any identity. Your saved progress and badges remain in on-device storage only.",
  },
  {
    q: "Contact info, identifiers, location, health, financials, contacts, photos, browsing history",
    a: "Only an email address for optional staff sign-in (Apple, Google, or email/password). No location, health, financial, contacts, photo, or browsing-history data is collected.",
  },
  {
    q: "Usage data / diagnostics / crash data",
    a: "Product interaction (usage) data is collected anonymously for analytics, only with consent. No crash-reporting SDK is present and no other diagnostics are collected.",
  },
  {
    q: "Data encryption in transit",
    a: "Yes. The app is served over HTTPS/TLS.",
  },
  {
    q: "Data deletion request method",
    a: "In-app: staff accounts are deleted from Account settings (Delete account), which removes the auth user, email preferences, and roles immediately. Learners clear on-device data with Reset progress on the Support page, by clearing site data, or by removing the app. Anonymous analytics events cannot be tied to an individual; requests can also be sent to builtstrong1@outlook.com.",
  },
  {
    q: "Account creation, third-party login, ads, in-app purchases, user-generated content",
    a: "None of these are present in the app.",
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
