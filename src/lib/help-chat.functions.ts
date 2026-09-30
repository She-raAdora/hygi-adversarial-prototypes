import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

/** Verifies a Turnstile token and issues a short-lived help-chat session token. */
export const startHelpChatSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ captchaToken: z.string().min(1).max(4096) }).parse(input))
  .handler(async ({ data }) => {
    const { captchaConfigured, verifyTurnstileToken } = await import("./captcha.server");
    if (!captchaConfigured()) throw new Error("Help chat is unavailable right now.");
    const ok = await verifyTurnstileToken(data.captchaToken, getRequestIP({ xForwardedFor: true }));
    if (!ok) throw new Error("Verification failed. Please try again.");
    const { issueHelpChatToken } = await import("./help-chat-session.server");
    return { token: issueHelpChatToken() };
  });
