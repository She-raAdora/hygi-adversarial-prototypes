import { useState } from "react";

import { Turnstile, type CaptchaState } from "@/components/Turnstile";
import { submitContactRequest } from "@/lib/captcha.functions";

/**
 * CAPTCHA-protected message form. Submissions are verified server-side with
 * Cloudflare Turnstile before anything is recorded, so bots cannot flood it.
 */
export function ContactRequestForm({
  kind,
  heading,
  intro,
  messageLabel,
  submitLabel,
  successText,
}: {
  kind: "support" | "deletion";
  heading: string;
  intro: string;
  messageLabel: string;
  submitLabel: string;
  successText: string;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaState>({ required: false, token: null });
  const [captchaReset, setCaptchaReset] = useState(0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (captcha.required && !captcha.token) {
      setError("Complete the CAPTCHA to continue.");
      return;
    }
    setBusy(true);
    try {
      await submitContactRequest({
        data: { kind, email, message, captchaToken: captcha.token ?? "unverified" },
      });
      setSent(true);
      setEmail("");
      setMessage("");
    } catch (err) {
      setCaptchaReset((n) => n + 1);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We could not send that. Please email us instead.",
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground";

  return (
    <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>

      {sent ? (
        <p className="mt-4 text-sm text-primary" role="status">
          {successText}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor={`${kind}-email`} className="text-sm font-medium text-foreground">
              Your email
            </label>
            <input
              id={`${kind}-email`}
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${kind}-message`} className="text-sm font-medium text-foreground">
              {messageLabel}
            </label>
            <textarea
              id={`${kind}-message`}
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>

          <Turnstile action={kind} onChange={setCaptcha} resetKey={captchaReset} />

          <div aria-live="polite">
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <button
            type="submit"
            disabled={busy || (captcha.required && !captcha.token)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Sending…" : submitLabel}
          </button>
        </form>
      )}
    </section>
  );
}
