import { createFileRoute, Link } from "@tanstack/react-router";

import { ContactRequestForm } from "@/components/ContactRequestForm";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "Delete Your Account & Data — Hygi." },
      {
        name: "description",
        content:
          "How to delete your Hygi. account and all associated data, what gets removed, how long it takes, and how to request deletion by email.",
      },
      { property: "og:title", content: "Delete Your Account & Data — Hygi." },
      {
        property: "og:description",
        content:
          "Step-by-step instructions to permanently delete your Hygi. account and every record tied to it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteAccountPage,
});

const DELETED = [
  "Your sign-in account (email address, password credential, and any linked Apple or Google identity)",
  "Your admin or staff role assignment, if you had one",
  "Your email notification preferences",
];

const NOT_STORED = [
  "Lesson progress, quiz scores, and badges — these live only in your browser's local storage and never reach our servers",
  "Quiz answers — they are never uploaded",
  "Share cards — they are generated on your device and never uploaded",
];

function DeleteAccountPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Delete your account and data
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Hygi. is developed by NorthBridge. Most people use Hygi. with no account at all — accounts
        exist only for staff who need the admin and Insights pages. If you do have one, you can
        delete it permanently at any time.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Delete it yourself, in the app</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Open{" "}
            <Link to="/auth" className="font-medium text-foreground underline underline-offset-4">
              Sign in
            </Link>{" "}
            and sign in to the account you want removed.
          </li>
          <li>
            Go to{" "}
            <Link
              to="/settings"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Account settings
            </Link>
            .
          </li>
          <li>Scroll to the “Delete account” section.</li>
          <li>Confirm. The account and all records listed below are erased immediately.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          Request deletion by email instead
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          If you cannot sign in, email{" "}
          <a
            href="mailto:builtstrong1@outlook.com?subject=Delete%20my%20Hygi.%20account"
            className="font-medium text-foreground underline underline-offset-4"
          >
            builtstrong1@outlook.com
          </a>{" "}
          from the address on the account and ask us to delete it. We verify the request and
          complete deletion within 30 days, usually within a few business days.
        </p>
      </section>

      <ContactRequestForm
        kind="deletion"
        heading="Or request deletion with this form"
        intro="Submit the email address on the account and we'll verify the request before erasing it. A quick CAPTCHA keeps automated requests out."
        messageLabel="Anything we should know?"
        submitLabel="Request deletion"
        successText="Request received. We'll verify it and confirm by email once the account is deleted."
      />

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">What gets deleted</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {DELETED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Deletion is immediate and permanent. Nothing is retained after the fact except anonymous,
          aggregate analytics counts that were never linked to your identity, and any records we are
          legally required to keep.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">What we never had in the first place</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {NOT_STORED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          To clear device-stored progress and badges, use the “Reset progress” button on the{" "}
          <Link to="/support" className="font-medium text-foreground underline underline-offset-4">
            Support
          </Link>{" "}
          page, or clear your browser data.
        </p>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        See our{" "}
        <Link to="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>{" "}
        for full details on what we collect and how long we keep it.
      </p>
    </main>
  );
}