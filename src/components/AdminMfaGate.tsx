import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "@/lib/access.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminMfaGate({ children }: { children: React.ReactNode }) {
  const fetchAccess = useServerFn(getMyAccess);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const accessQuery = useQuery({
    queryKey: ["my-access"],
    queryFn: () => fetchAccess(),
    staleTime: 60_000,
  });
  const mfaQuery = useQuery({
    queryKey: ["admin-mfa-gate"],
    enabled: accessQuery.data?.isAdmin === true,
    queryFn: async () => {
      const [factors, assurance] = await Promise.all([
        supabase.auth.mfa.listFactors(),
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      ]);
      if (factors.error) throw factors.error;
      if (assurance.error) throw assurance.error;
      return {
        factor: factors.data.totp.find((item) => item.status === "verified") ?? null,
        currentLevel: assurance.data.currentLevel,
      };
    },
  });

  const needsChallenge =
    accessQuery.data?.isAdmin === true &&
    Boolean(mfaQuery.data?.factor) &&
    mfaQuery.data?.currentLevel !== "aal2" &&
    !verified;

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const factor = mfaQuery.data?.factor;
    if (!factor || code.length !== 6) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code,
    });
    setBusy(false);
    if (verifyError) {
      setError("That code wasn't accepted. Wait for a new code and try again.");
      setCode("");
      return;
    }
    setVerified(true);
  }

  if (accessQuery.isPending || (accessQuery.data?.isAdmin && mfaQuery.isPending)) {
    return (
      <main id="main-content" className="mx-auto max-w-xl px-6 py-20">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Checking account security…
        </p>
      </main>
    );
  }

  if (!needsChallenge) return children;

  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-20">
      <ShieldCheck className="size-9 text-primary" aria-hidden="true" />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Verify it's you</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Enter the six-digit code from your authenticator app to continue to Hygi's admin tools.
      </p>
      <form className="mt-7" onSubmit={verifyCode}>
        <label htmlFor="admin-mfa-code" className="text-sm font-medium">
          Authenticator code
        </label>
        <Input
          id="admin-mfa-code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          className="mt-2 max-w-48 text-lg tracking-widest"
          autoFocus
          required
        />
        <Button type="submit" className="mt-4" disabled={busy || code.length !== 6}>
          {busy ? "Verifying…" : "Verify and continue"}
        </Button>
        <p className="mt-3 text-sm text-destructive-strong" aria-live="polite">
          {error ?? ""}
        </p>
      </form>
    </main>
  );
}