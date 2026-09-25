import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Enrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export function AdminMfaSettings() {
  const queryClient = useQueryClient();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const factorsQuery = useQuery({
    queryKey: ["mfa-factors"],
    queryFn: async () => {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;
      return data.totp;
    },
  });
  const verifiedFactors = (factorsQuery.data ?? []).filter((factor) => factor.status === "verified");

  const enrollMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      const pending = (factorsQuery.data ?? []).filter((factor) => factor.status !== "verified");
      await Promise.all(pending.map((factor) => supabase.auth.mfa.unenroll({ factorId: factor.id })));
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Hygi admin authenticator",
        issuer: "Hygi",
      });
      if (enrollError) throw enrollError;
      return {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    },
    onSuccess: (data) => {
      setEnrollment(data);
      setCode("");
      setConfirmed(false);
    },
    onError: (cause) => setError(cause instanceof Error ? cause.message : "Setup couldn't start."),
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!enrollment) throw new Error("Start setup again.");
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollment.factorId,
        code,
      });
      if (verifyError) throw verifyError;
    },
    onSuccess: async () => {
      setEnrollment(null);
      setCode("");
      setError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mfa-factors"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-mfa-gate"] }),
      ]);
    },
    onError: () => {
      setError("That code wasn't accepted. Wait for a new code and try again.");
      setCode("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (factorId: string) => {
      const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId });
      if (removeError) throw removeError;
    },
    onSuccess: async () => {
      setConfirmed(false);
      setError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mfa-factors"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-mfa-gate"] }),
      ]);
    },
    onError: (cause) => setError(cause instanceof Error ? cause.message : "Authenticator couldn't be removed."),
  });

  if (factorsQuery.isPending) {
    return <p className="mt-4 text-sm text-muted-foreground">Checking authenticator status…</p>;
  }

  return (
    <div aria-labelledby="admin-mfa-heading">
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 size-5 text-primary" aria-hidden="true" />
        <div>
          <h2 id="admin-mfa-heading" className="text-lg font-semibold">Authenticator app</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Protect admin tools with a rotating six-digit code from an authenticator app.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium">
        {verifiedFactors.length > 0 ? (
          <><CheckCircle2 className="size-4 text-success-strong" aria-hidden="true" /> Enabled</>
        ) : (
          <><ShieldAlert className="size-4 text-muted-foreground" aria-hidden="true" /> Not enabled</>
        )}
      </div>

      {enrollment ? (
        <div className="mt-5 border-l-2 border-primary pl-5">
          <h3 className="font-semibold">Scan, then verify</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Scan this code with your authenticator app.</li>
            <li>Enter the six-digit code it shows.</li>
          </ol>
          <img src={enrollment.qrCode} alt="Authenticator setup QR code" className="mt-4 size-44 border border-border bg-card p-2" />
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-medium">Can't scan? Use the setup key</summary>
            <code className="mt-2 block break-all rounded-md bg-muted p-3 text-xs" aria-label="Manual authenticator setup key">
              {enrollment.secret}
            </code>
          </details>
          <form
            className="mt-5"
            onSubmit={(event) => {
              event.preventDefault();
              verifyMutation.mutate();
            }}
          >
            <label htmlFor="mfa-enrollment-code" className="text-sm font-medium">Six-digit code</label>
            <Input
              id="mfa-enrollment-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              className="mt-2 max-w-48 text-lg tracking-widest"
              autoFocus
              required
            />
            <Button type="submit" className="mt-3" disabled={verifyMutation.isPending || code.length !== 6}>
              {verifyMutation.isPending ? "Verifying…" : "Finish setup"}
            </Button>
          </form>
        </div>
      ) : verifiedFactors.length === 0 ? (
        <Button className="mt-5" onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending}>
          {enrollMutation.isPending ? "Starting…" : "Set up authenticator"}
        </Button>
      ) : (
        <div className="mt-5">
          {!confirmed ? (
            <Button variant="outline" onClick={() => setConfirmed(true)}>Remove authenticator</Button>
          ) : (
            <div className="border-l-2 border-destructive pl-4">
              <p className="text-sm text-muted-foreground">This returns the account to its previous sign-in protection.</p>
              <div className="mt-3 flex gap-2">
                <Button variant="destructive" onClick={() => removeMutation.mutate(verifiedFactors[0].id)} disabled={removeMutation.isPending}>
                  {removeMutation.isPending ? "Removing…" : "Confirm removal"}
                </Button>
                <Button variant="outline" onClick={() => setConfirmed(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        TOTP is stronger than password-only sign-in, but typed codes can still be phished. Passkeys and hardware security keys are phishing-resistant.
      </p>
      <p className="mt-3 text-sm text-destructive-strong" aria-live="polite">
        {error ?? (factorsQuery.isError ? "Authenticator status couldn't be loaded." : "")}
      </p>
    </div>
  );
}