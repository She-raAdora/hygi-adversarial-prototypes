import { createHmac, timingSafeEqual } from "crypto";

/**
 * Short-lived, signed help-chat session tokens. Issued only after a Turnstile
 * check passes, so the paid AI endpoint cannot be driven by scripted callers.
 */
const TTL_MS = 60 * 60 * 1000;

function key(): string | null {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  return secret ? `help-chat-session:${secret}` : null;
}

function sign(payload: string, k: string) {
  return createHmac("sha256", k).update(payload).digest("base64url");
}

export function issueHelpChatToken(): string {
  const k = key();
  if (!k) throw new Error("Help chat is not configured.");
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload, k)}`;
}

export function verifyHelpChatToken(token: string | null): boolean {
  const k = key();
  if (!k || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = Buffer.from(sign(payload, k));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
