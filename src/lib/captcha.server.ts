/**
 * Server-only Cloudflare Turnstile verification.
 *
 * TURNSTILE_SECRET_KEY is a server secret and never reaches the browser. When
 * it is absent the widget is treated as not configured: callers decide whether
 * to fail closed (contact forms) or continue without the extra check.
 */
export function captchaConfigured(): boolean {
  return Boolean(process.env["TURNSTILE_SECRET_KEY"] && process.env["TURNSTILE_SITE_KEY"]);
}

export async function verifyTurnstileToken(token: string, ip?: string | null): Promise<boolean> {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  if (!secret) return false;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (error) {
    console.error("turnstile verification failed", error);
    return false;
  }
}
