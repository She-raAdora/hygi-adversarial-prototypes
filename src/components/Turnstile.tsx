import { useEffect, useId, useRef, useState } from "react";

import { getCaptchaConfig } from "@/lib/captcha.functions";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
      action?: string;
    },
  ) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile script failed")));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile script failed"));
    document.head.appendChild(script);
  });
}

export type CaptchaState = {
  /** Turnstile is configured on the server and a token is required. */
  required: boolean;
  /** Latest solved token, if any. */
  token: string | null;
};

/**
 * Cloudflare Turnstile widget. Renders nothing when Turnstile is not configured
 * server-side, and reports `required: false` so forms stay usable.
 */
export function Turnstile({
  action,
  onChange,
  resetKey = 0,
}: {
  action: string;
  onChange: (state: CaptchaState) => void;
  /** Change this value to clear a solved token (e.g. after a failed submit). */
  resetKey?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const labelId = useId();

  useEffect(() => {
    let active = true;
    void getCaptchaConfig()
      .then((config) => {
        if (!active) return;
        setSiteKey(config.siteKey);
        onChangeRef.current({ required: config.enabled, token: null });
      })
      .catch(() => {
        if (active) onChangeRef.current({ required: false, token: null });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!siteKey || !containerRef.current || widgetIdRef.current) return;
    let active = true;
    void loadScript()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "auto",
          callback: (token) => onChangeRef.current({ required: true, token }),
          "expired-callback": () => onChangeRef.current({ required: true, token: null }),
          "error-callback": () => onChangeRef.current({ required: true, token: null }),
        });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [siteKey, action]);

  useEffect(() => {
    if (resetKey === 0 || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
    onChangeRef.current({ required: true, token: null });
  }, [resetKey]);

  if (!siteKey) return null;

  return (
    <div>
      <p id={labelId} className="text-sm font-medium text-foreground">
        Confirm you’re human
      </p>
      <div ref={containerRef} className="mt-2" aria-describedby={labelId} />
      {failed ? (
        <p className="mt-2 text-sm text-destructive">
          The CAPTCHA could not load. Check your connection and reload the page.
        </p>
      ) : null}
    </div>
  );
}
