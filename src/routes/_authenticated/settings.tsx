import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { getMyAccess } from "@/lib/access.functions";
import { getMyEmailPreferences, updateMyEmailPreferences } from "@/lib/email-prefs.functions";
import { deleteMyAccount } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — Hygi" },
      {
        name: "description",
        content:
          "Manage your Hygi account: control admin notification emails and permanently delete your account and all associated data.",
      },
      { property: "og:title", content: "Account Settings — Hygi" },
      {
        property: "og:description",
        content:
          "Manage your Hygi account: control admin notification emails and permanently delete your account and all associated data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/settings" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/settings" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetchAccess = useServerFn(getMyAccess);
  const fetchPrefs = useServerFn(getMyEmailPreferences);
  const savePrefs = useServerFn(updateMyEmailPreferences);
  const removeAccount = useServerFn(deleteMyAccount);
  const [confirmText, setConfirmText] = useState("");

  const accessQuery = useQuery({
    queryKey: ["my-access"],
    queryFn: () => fetchAccess(),
    staleTime: 60_000,
  });

  const prefsQuery = useQuery({
    queryKey: ["email-prefs"],
    queryFn: () => fetchPrefs(),
  });

  const prefsMutation = useMutation({
    mutationFn: (adminRoleEmails: boolean) => savePrefs({ data: { adminRoleEmails } }),
    onSuccess: (result) => {
      queryClient.setQueryData(["email-prefs"], result);
    },
  });

  const optedIn = prefsQuery.data?.adminRoleEmails ?? true;

  const deleteMutation = useMutation({
    mutationFn: () => removeAccount(),
    onSuccess: async () => {
      await supabase.auth.signOut();
      queryClient.clear();
      void navigate({ to: "/", replace: true });
    },
  });

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Account settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {accessQuery.data?.email
          ? `Preferences for ${accessQuery.data.email}`
          : "Preferences for your account"}
      </p>

      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">Notification emails</h2>

        {prefsQuery.isPending ? (
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Loading your preferences…
          </p>
        ) : prefsQuery.isError ? (
          <p className="mt-4 text-sm text-destructive" aria-live="polite">
            Couldn't load your preferences. Reload the page to try again.
          </p>
        ) : (
          <div className="mt-4 flex items-start gap-3">
            <input
              id="admin-role-emails"
              type="checkbox"
              checked={optedIn}
              onChange={(event) => prefsMutation.mutate(event.target.checked)}
              disabled={prefsMutation.isPending}
              className="mt-1 size-4 rounded border-input accent-primary"
            />
            <div>
              <label htmlFor="admin-role-emails" className="text-sm font-medium text-foreground">
                Email me when my admin access changes
              </label>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Sends a short notice to your account email whenever an administrator grants or
                revokes your admin role. Unticking this opts you out of those emails — you'll still
                see your current role on the admin page.
              </p>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm" aria-live="polite">
          {prefsMutation.isPending ? (
            <span className="text-muted-foreground">Saving…</span>
          ) : prefsMutation.isError ? (
            <span className="text-destructive">Couldn't save that change. Please try again.</span>
          ) : prefsMutation.isSuccess ? (
            <span className="text-primary">
              Saved — admin-role emails are {optedIn ? "on" : "off"}.
            </span>
          ) : (
            ""
          )}
        </p>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        Security notices required to keep your account safe are always sent, regardless of this
        setting. See the{" "}
        <Link to="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>{" "}
        for how we handle your email address.
      </p>

      <section className="mt-10 rounded-2xl border border-destructive/40 bg-card p-6">
        <h2 className="text-lg font-semibold text-destructive">Delete account</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Permanently deletes your sign-in account, your email preferences, and any admin role you
          hold. This happens immediately and cannot be undone. Lesson progress and badges live on
          your device and are not affected — clear those from{" "}
          <Link to="/support" className="underline hover:text-foreground">
            Support
          </Link>
          .
        </p>

        <label htmlFor="confirm-delete" className="mt-4 block text-sm font-medium text-foreground">
          Type DELETE to confirm
        </label>
        <input
          id="confirm-delete"
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          autoComplete="off"
          className="mt-1.5 w-full max-w-xs rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
        />

        <button
          type="button"
          disabled={confirmText !== "DELETE" || deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
          className="mt-4 rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "Deleting…" : "Delete my account permanently"}
        </button>

        <p className="mt-3 text-sm" aria-live="polite">
          {deleteMutation.isError ? (
            <span className="text-destructive">
              Couldn't delete the account. Please try again or email builtstrong1@outlook.com.
            </span>
          ) : (
            ""
          )}
        </p>
      </section>
    </main>
  );
}
