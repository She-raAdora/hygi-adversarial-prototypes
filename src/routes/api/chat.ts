import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { buildHelpSystemPrompt } from "@/lib/help-knowledge.server";

type ChatRequestBody = { messages?: unknown };

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 12_000;
const MAX_BODY_BYTES = 32_000;

function messageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const parts = (message as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) =>
      part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string"
        ? ((part as { text: string }).text)
        : "",
    )
    .join("");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Only allow the app's own pages to call this paid endpoint.
        const origin = request.headers.get("origin");
        if (!origin || origin !== new URL(request.url).origin) {
          return new Response("Forbidden", { status: 403 });
        }

        // Paid AI endpoint: only signed-in users may call it.
        const authHeader = request.headers.get("authorization") ?? "";
        const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        const supabaseUrl = process.env["SUPABASE_URL"];
        const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!bearer || bearer.split(".").length !== 3 || !supabaseUrl || !publishableKey) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { createClient } = await import("@supabase/supabase-js");
        const authClient = createClient(supabaseUrl, publishableKey, {
          // New publishable keys are opaque strings, not JWTs: always send the
          // apikey header and never forward it as a bearer token (matches the
          // fetch wrapper in src/integrations/supabase/client.ts).
          global: {
            fetch: (input, init) => {
              const headers = new Headers(
                typeof Request !== "undefined" && input instanceof Request
                  ? input.headers
                  : undefined,
              );
              if (init?.headers) {
                new Headers(init.headers).forEach((value, key) => headers.set(key, value));
              }
              if (headers.get("Authorization") === `Bearer ${publishableKey}`) {
                headers.delete("Authorization");
              }
              headers.set("apikey", publishableKey);
              return fetch(input, { ...init, headers });
            },
          },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(bearer);
        if (claimsError || !claimsData?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return new Response("Request too large", { status: 413 });
        }

        let parsed: ChatRequestBody;
        try {
          parsed = JSON.parse(raw) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const { messages } = parsed;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const trimmed = messages.slice(-MAX_MESSAGES);
        let totalChars = 0;
        for (const message of trimmed) {
          const text = messageText(message);
          if (text.length > MAX_MESSAGE_CHARS) {
            return new Response("Message too long", { status: 413 });
          }
          totalChars += text.length;
        }
        if (totalChars > MAX_TOTAL_CHARS) {
          return new Response("Conversation too long", { status: 413 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: buildHelpSystemPrompt(),
          maxOutputTokens: 800,
          messages: await convertToModelMessages(trimmed as UIMessage[]),
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: trimmed as UIMessage[],
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});