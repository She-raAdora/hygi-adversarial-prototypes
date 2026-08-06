import { useState } from "react";
import { Check, ChevronDown, Download, Loader2, Share2 } from "lucide-react";
import {
  downloadResultCard,
  shareResultCard,
  SHARE_FORMATS,
  type ShareCard,
  type ShareFormat,
} from "@/lib/shareCard";
import { recordReferral } from "@/lib/referrals";

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
  const [format, setFormat] = useState<ShareFormat>("landscape");
  const [open, setOpen] = useState(false);
  const active = SHARE_FORMATS.find((f) => f.id === format)!;

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70";
  const skin =
    variant === "solid"
      ? "text-primary-foreground"
      : "border border-border bg-background hover:bg-secondary";

  async function onShare() {
    setState("busy");
    try {
      const outcome = await shareResultCard(card, text, format);
      recordReferral();
      setState(outcome === "downloaded" ? "saved" : "idle");
    } catch {
      setState("error");
    }
    if (state !== "error") setTimeout(() => setState("idle"), 4000);
  }

  async function onDownload() {
    setState("downloading");
    try {
      const outcome = await downloadResultCard(card, format);
      recordReferral();
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`${base} ${skin}`}
        style={variant === "solid" ? { background: "var(--gradient-hero)" } : undefined}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <span className="mt-1 inline-flex w-full max-w-xs flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Choose a format
          </span>
          <span
            className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-secondary/40 p-1"
            role="radiogroup"
            aria-label="Image format"
          >
            {SHARE_FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={format === f.id}
                onClick={() => setFormat(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  format === f.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
                <span className="sr-only"> — {f.hint}</span>
              </button>
            ))}
          </span>
          <span className="text-xs text-muted-foreground">{active.hint}</span>
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
              {state === "busy" ? "Creating image…" : "Share image"}
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
        </span>
      )}
      <span className="text-xs text-muted-foreground" role="status">
        {message}
      </span>
    </span>
  );
}
