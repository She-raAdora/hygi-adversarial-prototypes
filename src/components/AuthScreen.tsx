import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Turnstile, type CaptchaState } from "@/components/Turnstile";
import { verifyAuthCaptcha } from "@/lib/captcha.functions";
import { AgeCheck, UnderAgeNotice } from "@/components/AgeCheck";
import { AGE_STORAGE_KEY } from "@/lib/ageGate";

export function AuthScreen({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<CaptchaState>({ required: false, token: null });
  const [captchaReset, setCaptchaReset] = useState(0);
  const [age, setAge] = useState<"unknown" | "ok" | "under">("unknown");
  const [pendingProvider, setPendingProvider] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(AGE_STORAGE_KEY);
    if (saved === "ok" || saved === "under") setAge(saved);
  }, []);

  function onAgeResult(under: boolean) {
    const next = under ? "under" : "ok";
    window.localStorage.setItem(AGE_STORAGE_KEY, next);
    setAge(next);
    if (!under && pendingProvider) {
      const provider = pendingProvider;
      setPendingProvider(null);
      void onOAuth(provider);
    }
  }

  function startOAuth(provider: "google" | "apple") {
    if (age === "ok") void onOAuth(provider);
    else setPendingProvider(provider);
  }

  const showAgeCheck = age === "unknown" && (mode === "signup" || pendingProvider !== null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate({ to: "/badges", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (captcha.required) {
        if (!captcha.token) {
          setError("Complete the CAPTCHA to continue.");
          return;
        }
        const check = await verifyAuthCaptcha({ data: { captchaToken: captcha.token } });
        if (!check.ok) {
          setCaptchaReset((n) => n + 1);
          setError("CAPTCHA check failed. Please try again.");
          return;
        }
      }
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            ...(captcha.token ? { captchaToken: captcha.token } : {}),
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Check your email to confirm the account, then sign in.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
          ...(captcha.token ? { options: { captchaToken: captcha.token } } : {}),
        });
        if (signInError) throw signInError;
      }
      await router.invalidate();
      void navigate({ to: "/badges", replace: true });
    } catch (err) {
      setCaptchaReset((n) => n + 1);
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onOAuth(provider: "google" | "apple") {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      setError(
        provider === "apple"
          ? "Apple sign-in didn't complete. Try again."
          : "Google sign-in didn't complete. Try again.",
      );
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    await router.invalidate();
    void navigate({ to: "/badges", replace: true });
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{mode === "signup" ? "Create your free account" : "Sign in"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create a free account to keep your badges, certificates and pathway progress on every device. Anything you've already earned here comes with you. Lessons stay open to everyone — no account needed.
      </p>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
        {age === "under" ? (
          <UnderAgeNotice />
        ) : showAgeCheck ? (
          <>
            <AgeCheck onResult={onAgeResult} />
            <button
              type="button"
              onClick={() => {
                setPendingProvider(null);
                setMode("signin");
              }}
              className="mt-4 w-full text-center text-sm text-muted-foreground underline underline-offset-4"
            >
              Back to sign in
            </button>
          </>
        ) : (
        <>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => startOAuth("apple")}
            disabled={busy}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={() => startOAuth("google")}
            disabled={busy}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          or
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div aria-live="polite">
            {error ? <p className="text-sm text-destructive-strong">{error}</p> : null}
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>

          <Turnstile action="auth" onChange={setCaptcha} resetKey={captchaReset} />

          <button
            type="submit"
            disabled={busy || (captcha.required && !captcha.token)}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setMessage(null);
            }}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
        </>
        )}
      </div>
    </main>
  );
}
