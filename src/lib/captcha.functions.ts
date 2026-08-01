import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const contactSchema = z.object({
  kind: z.enum(["support", "deletion"]),
  email: z.string().trim().email({ message: "Enter a valid email address." }).max(255),
  message: z
    .string()
    .trim()
    .min(10, { message: "Add a little more detail (10 characters minimum)." })
    .max(2000, { message: "Keep the message under 2000 characters." }),
  captchaToken: z.string().min(1, { message: "Complete the CAPTCHA first." }).max(4096),
});

const tokenSchema = z.object({
  captchaToken: z.string().min(1).max(4096),
});

/** Public: tells the browser whether to render the widget, and with which site key. */
export const getCaptchaConfig = createServerFn({ method: "GET" }).handler(async () => {
  const siteKey = process.env["TURNSTILE_SITE_KEY"] ?? null;
  const enabled = Boolean(siteKey && process.env["TURNSTILE_SECRET_KEY"]);
  return { enabled, siteKey: enabled ? siteKey : null };
});

/** Verifies a token before a sign-in / sign-up attempt is allowed to proceed. */
export const verifyAuthCaptcha = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { captchaConfigured, verifyTurnstileToken } = await import("./captcha.server");
    if (!captchaConfigured()) return { ok: true, skipped: true };
    const ok = await verifyTurnstileToken(data.captchaToken, getRequestIP({ xForwardedFor: true }));
    return { ok, skipped: false };
  });

/** Support / deletion request form. Fails closed when the CAPTCHA does not pass. */
export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { captchaConfigured, verifyTurnstileToken } = await import("./captcha.server");
    const configured = captchaConfigured();
    if (configured) {
      const ok = await verifyTurnstileToken(
        data.captchaToken,
        getRequestIP({ xForwardedFor: true }),
      );
      if (!ok) throw new Error("CAPTCHA check failed. Please try again.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_requests").insert({
      kind: data.kind,
      email: data.email,
      message: data.message,
      captcha_verified: configured,
    });
    if (error) throw new Error("We could not record your request. Please email us instead.");
    return { ok: true };
  });
