import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyAccess } from "@/lib/access.functions";
import { claimFirstAdmin, listUsers, setAdminRole } from "@/lib/admin-users.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Manage Hygi. Access" },
      {
        name: "description",
        content:
          "Admin-only console for Hygi.: review accounts and grant or revoke admin access to the analytics dashboard.",
      },
      { property: "og:title", content: "Admin — Manage Hygi. Access" },
      {
        property: "og:description",
        content: "Review accounts and grant or revoke admin access to Hygi. analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminGate,
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AdminGate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAccess = useServerFn(getMyAccess);
  const claim = useServerFn(claimFirstAdmin);

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-access"],
    queryFn: () => fetchAccess(),
    staleTime: 60_000,
  });

  const claimMutation = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-access"] }),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (isPending) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Checking your access…
        </p>
      </main>
    );
  }

  if (isError || !data?.isAdmin) {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight">Admin access required</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {data?.email ? `${data.email} isn't` : "This account isn't"} an administrator yet. If no
          administrator has been set up for Hygi. yet, you can claim the first admin seat below —
          after that, only existing admins can grant access.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => claimMutation.mutate()}
            disabled={claimMutation.isPending}
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {claimMutation.isPending ? "Claiming…" : "Claim first admin seat"}
          </button>
          <Link
            to="/lessons"
            className="inline-flex items-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Back to lessons
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
        <p className="mt-4 text-sm text-destructive" aria-live="polite">
          {claimMutation.isError
            ? (claimMutation.error as Error).message ||
              "Couldn't claim admin — an administrator may already exist."
            : ""}
        </p>
      </main>
    );
  }

  return <AdminUsers email={data.email} onSignOut={signOut} />;
}

function AdminUsers({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const queryClient = useQueryClient();
  const fetchUsers = useServerFn(listUsers);
  const updateRole = useServerFn(setAdminRole);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers(),
  });

  const roleMutation = useMutation({
    mutationFn: (vars: { userId: string; makeAdmin: boolean }) => updateRole({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["my-access"] });
    },
  });

  const users = usersQuery.data ?? [];
  const adminCount = users.filter((u) => u.isAdmin).length;

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users &amp; admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {email ?? "an admin"} · {users.length} account
            {users.length === 1 ? "" : "s"} · {adminCount} admin{adminCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/insights"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Insights dashboard
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-destructive" aria-live="polite">
        {roleMutation.isError
          ? (roleMutation.error as Error).message || "Couldn't update that account."
          : ""}
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Accounts with sign-up date, last sign-in, and admin status
          </caption>
          <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Joined
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Last sign-in
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Role
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            {usersQuery.isPending ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-muted-foreground">
                  Loading accounts…
                </td>
              </tr>
            ) : usersQuery.isError ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-destructive">
                  Couldn't load accounts.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-muted-foreground">
                  No accounts yet.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const pending =
                  roleMutation.isPending && roleMutation.variables?.userId === u.id;
                return (
                  <tr key={u.id} className="border-b border-border/40 last:border-0">
                    <td className="px-5 py-4 font-medium text-foreground">{u.email ?? "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(u.lastSignInAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          u.isAdmin
                            ? "inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                            : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {u.isAdmin ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          roleMutation.mutate({ userId: u.id, makeAdmin: !u.isAdmin })
                        }
                        disabled={pending}
                        className="inline-flex items-center rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
                      >
                        {pending ? "Saving…" : u.isAdmin ? "Revoke admin" : "Make admin"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Admins can open the Insights dashboard. You can't revoke your own admin access — ask another
        admin to do it.
      </p>
    </main>
  );
}
