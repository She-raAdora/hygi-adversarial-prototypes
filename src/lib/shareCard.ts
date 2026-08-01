/**
 * Draws a shareable result card on a canvas, entirely in the browser.
 *
 * Nothing is uploaded: the PNG is produced locally and handed to the Web Share
 * API when the device supports sharing files, otherwise downloaded.
 */

export type ShareCard = {
  /** Big line, e.g. the lesson title or "Digital Hygiene Champion". */
  title: string;
  /** Small line above the title, e.g. "Badge unlocked". */
  eyebrow: string;
  /** Result line, e.g. "3 / 3 correct". */
  stat: string;
  /** Optional emoji rendered in the badge tile. */
  emoji?: string;
  /** Optional supporting sentence. */
  note?: string;
};

/** Available card shapes, sized for the platforms each one suits best. */
export type ShareFormat = "landscape" | "square" | "portrait";

export const SHARE_FORMATS: Array<{
  id: ShareFormat;
  label: string;
  hint: string;
  width: number;
  height: number;
}> = [
  { id: "landscape", label: "Landscape", hint: "1200 × 630 — link previews, X, LinkedIn", width: 1200, height: 630 },
  { id: "square", label: "Square", hint: "1080 × 1080 — Instagram, Facebook feed", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait", hint: "1080 × 1350 — Stories, Reels, Pinterest", width: 1080, height: 1350 },
];

function dimensions(format: ShareFormat) {
  const entry = SHARE_FORMATS.find((f) => f.id === format) ?? SHARE_FORMATS[0]!;
  return { W: entry.width, H: entry.height };
}

const INK = "#14453f";
const MUTED = "#4c6f6a";
const TEAL = "#2a9d8f";
const GLOW = "#5ecfbb";
const PAPER = "#f2faf7";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) return lines;
    } else {
      line = attempt;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

/** Renders the card and returns it as a PNG blob. */
export async function renderShareCard(
  card: ShareCard,
  format: ShareFormat = "landscape",
): Promise<Blob> {
  const { W, H } = dimensions(format);
  const stacked = format !== "landscape";
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");

  // Backdrop
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  const wash = ctx.createLinearGradient(0, 0, W, H);
  wash.addColorStop(0, "rgba(94, 207, 187, 0.28)");
  wash.addColorStop(1, "rgba(42, 157, 143, 0.06)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  // Card surface
  const pad = stacked ? 48 : 56;
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 44);
  ctx.fill();
  ctx.strokeStyle = "rgba(42, 157, 143, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const gutter = pad + 56;

  // Measure the text block first so the taller formats can be centred instead
  // of leaving a large gap above the footer.
  const left = stacked ? gutter : 300;
  const maxText = W - left - gutter;
  const titleSize = stacked ? 68 : 62;
  const titleLead = titleSize + 10;
  const maxLines = stacked ? 3 : 2;
  const tileSize = 148;

  ctx.font = `700 ${titleSize}px system-ui, sans-serif`;
  const titleLines = wrap(ctx, card.title, maxText, maxLines);
  ctx.font = "30px system-ui, sans-serif";
  const noteLines = card.note ? wrap(ctx, card.note, maxText, maxLines) : [];

  const textHeight = titleLead + titleLines.length * titleLead + 26 + noteLines.length * 40;
  const footerTop = H - pad - 140;
  const blockHeight = stacked ? tileSize + 92 + textHeight : 0;

  // Badge tile: beside the text on landscape, above it on the taller formats.
  const tileX = gutter;
  const tileY = stacked
    ? Math.max(pad + 80, pad + 40 + (footerTop - pad - 40 - blockHeight) / 2)
    : 120;
  const tile = ctx.createLinearGradient(tileX, tileY, tileX + tileSize, tileY + tileSize);
  tile.addColorStop(0, GLOW);
  tile.addColorStop(1, TEAL);
  ctx.fillStyle = tile;
  roundRect(ctx, tileX, tileY, tileSize, tileSize, 36);
  ctx.fill();
  ctx.font = "72px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(card.emoji ?? "🏆", tileX + tileSize / 2, tileY + tileSize / 2 + 6);

  // Text block
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = TEAL;
  // Two-line titles need extra room, so the whole block starts a little higher.
  const top = stacked ? tileY + tileSize + 92 : titleLines.length > 1 ? 148 : 178;

  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText(card.eyebrow.toUpperCase(), left, top);

  ctx.fillStyle = INK;
  ctx.font = `700 ${titleSize}px system-ui, sans-serif`;
  titleLines.forEach((line, i) => ctx.fillText(line, left, top + titleLead + i * titleLead));

  const afterTitle = top + titleLead + titleLines.length * titleLead;

  ctx.fillStyle = TEAL;
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillText(card.stat, left, afterTitle + 26);

  if (noteLines.length) {
    ctx.fillStyle = MUTED;
    ctx.font = "30px system-ui, sans-serif";
    noteLines.forEach((line, i) => ctx.fillText(line, left, afterTitle + 90 + i * 40));
  }

  // Footer wordmark
  ctx.fillStyle = INK;
  ctx.font = "700 40px system-ui, sans-serif";
  ctx.fillText("Hygi.", gutter, H - pad - 96);
  ctx.fillStyle = MUTED;
  ctx.font = "26px system-ui, sans-serif";
  ctx.fillText("digitalhygiene.app", gutter, H - pad - 58);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image."))),
      "image/png",
    );
  });
}

export type ShareOutcome = "shared" | "downloaded" | "cancelled";

function cardFileName(card: ShareCard, format: ShareFormat) {
  const slug = card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { W, H } = dimensions(format);
  return `hygi-${slug}-${W}x${H}.png`;
}

export type DownloadOutcome = "downloaded" | "opened";

/**
 * Renders the card and saves it as a PNG file.
 *
 * iOS Safari ignores the anchor `download` attribute for blob URLs, so there we
 * open the image in a new tab where it can be long-pressed and saved to Photos.
 */
export async function downloadResultCard(
  card: ShareCard,
  format: ShareFormat = "landscape",
): Promise<DownloadOutcome> {
  const blob = await renderShareCard(card, format);
  const fileName = cardFileName(card, format);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const supportsDownload = "download" in a && !isIosSafari();

  if (supportsDownload) {
    a.href = url;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return "downloaded";
  }

  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return "opened";
}

function isIosSafari() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document);
  return iOS && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Renders the card, then shares it natively or falls back to a download. */
export async function shareResultCard(
  card: ShareCard,
  text: string,
  format: ShareFormat = "landscape",
): Promise<ShareOutcome> {
  const blob = await renderShareCard(card, format);
  const fileName = cardFileName(card, format);
  const file = new File([blob], fileName, { type: "image/png" });

  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text, title: "Hygi." });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Fall through to the download path on any other share failure.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}
