import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyAccess } from "@/lib/access.functions";
import { getMyEmailPreferences, updateMyEmailPreferences } from "@/lib/email-prefs.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Email Settings — Hygi." },
      {
        name: "description",
        content:
          "Choose whether Hygi. emails you when your admin access is granted or revoked. Opt out at any time.",
      },
      { property: "og:title", content: "Email Settings — Hygi." },
      {
        property: "og:description",
        content: "Control admin-role notification emails from Hygi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const fetchAccess = useServerFn(getMyAccess);
  const fetchPrefs = useServerFn(getMyEmailPreferences);
  const savePrefs = useServerFn(updateMyEmailPreferences);

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

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Email settings</h1>
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
    </main>
  );
}
