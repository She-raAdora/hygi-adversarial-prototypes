import { useState } from "react";
import { Check, Download, Loader2, Share2 } from "lucide-react";
import { downloadResultCard, shareResultCard, type ShareCard } from "@/lib/shareCard";

type Props = {
  card: ShareCard;
  /** Caption suggested to the share sheet. */
  text: string;
  /** Label shown on the button. */
  label?: string;
  variant?: "solid" | "outline";
  className?: string;
};

/** Creates a PNG result card on-device and shares or downloads it. */
export function ShareResultButton({
  card,
  text,
  label = "Share result",
  variant = "outline",
  className = "",
}: Props) {
  const [state, setState] = useState<
    "idle" | "busy" | "downloading" | "shared" | "saved" | "opened" | "error"
  >("idle");

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70";
  const skin =
    variant === "solid"
      ? "text-primary-foreground"
      : "border border-border bg-background hover:bg-secondary";

  async function onShare() {
    setState("busy");
    try {
      const outcome = await shareResultCard(card, text);
      setState(outcome === "downloaded" ? "saved" : "idle");
    } catch {
      setState("error");
    }
    if (state !== "error") setTimeout(() => setState("idle"), 4000);
  }

  async function onDownload() {
    setState("downloading");
    try {
      const outcome = await downloadResultCard(card);
      setState(outcome === "opened" ? "opened" : "saved");
      setTimeout(() => setState("idle"), 6000);
    } catch {
      setState("error");
    }
  }

  const message =
    state === "saved"
      ? "Image saved to your downloads."
      : state === "opened"
        ? "Image opened in a new tab — press and hold it to save to Photos."
        : state === "error"
          ? "Couldn't create the image on this device."
          : "";

  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <span className="inline-flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={state === "busy" || state === "downloading"}
          className={`${base} ${skin}`}
          style={variant === "solid" ? { background: "var(--gradient-hero)" } : undefined}
        >
          {state === "busy" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          )}
          {state === "busy" ? "Creating image…" : label}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={state === "busy" || state === "downloading"}
          className={`${base} border border-border bg-background hover:bg-secondary`}
        >
          {state === "downloading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : state === "saved" || state === "opened" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {state === "downloading" ? "Saving…" : "Download PNG"}
        </button>
      </span>
      <span className="text-xs text-muted-foreground" role="status">
        {message}
      </span>
    </span>
  );
}
