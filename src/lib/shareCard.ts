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

const W = 1200;
const H = 630;

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
export async function renderShareCard(card: ShareCard): Promise<Blob> {
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
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  roundRect(ctx, 56, 56, W - 112, H - 112, 44);
  ctx.fill();
  ctx.strokeStyle = "rgba(42, 157, 143, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Badge tile
  const tile = ctx.createLinearGradient(112, 120, 112 + 148, 120 + 148);
  tile.addColorStop(0, GLOW);
  tile.addColorStop(1, TEAL);
  ctx.fillStyle = tile;
  roundRect(ctx, 112, 120, 148, 148, 36);
  ctx.fill();
  ctx.font = "72px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(card.emoji ?? "🏆", 112 + 74, 120 + 80);

  // Text block
  const left = 300;
  const maxText = W - left - 112;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = TEAL;
  ctx.font = "600 26px system-ui, sans-serif";
  // Two-line titles need extra room, so the whole block starts a little higher.
  ctx.font = "700 62px system-ui, sans-serif";
  const lineCount = wrap(ctx, card.title, maxText, 2).length;
  const top = lineCount > 1 ? 148 : 178;

  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText(card.eyebrow.toUpperCase(), left, top);

  ctx.fillStyle = INK;
  ctx.font = "700 62px system-ui, sans-serif";
  const titleLines = wrap(ctx, card.title, maxText, 2);
  titleLines.forEach((line, i) => ctx.fillText(line, left, top + 72 + i * 72));

  const afterTitle = top + 72 + titleLines.length * 72;

  ctx.fillStyle = TEAL;
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillText(card.stat, left, afterTitle + 26);

  if (card.note) {
    ctx.fillStyle = MUTED;
    ctx.font = "30px system-ui, sans-serif";
    wrap(ctx, card.note, maxText, 2).forEach((line, i) =>
      ctx.fillText(line, left, afterTitle + 90 + i * 40),
    );
  }

  // Footer wordmark
  ctx.fillStyle = INK;
  ctx.font = "700 40px system-ui, sans-serif";
  ctx.fillText("Hygi.", 112, H - 108);
  ctx.fillStyle = MUTED;
  ctx.font = "26px system-ui, sans-serif";
  ctx.fillText("digitalhygiene.app", 112, H - 108 + 38);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image."))),
      "image/png",
    );
  });
}

export type ShareOutcome = "shared" | "downloaded" | "cancelled";

function cardFileName(card: ShareCard) {
  return `hygi-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`;
}

export type DownloadOutcome = "downloaded" | "opened";

/**
 * Renders the card and saves it as a PNG file.
 *
 * iOS Safari ignores the anchor `download` attribute for blob URLs, so there we
 * open the image in a new tab where it can be long-pressed and saved to Photos.
 */
export async function downloadResultCard(card: ShareCard): Promise<DownloadOutcome> {
  const blob = await renderShareCard(card);
  const fileName = cardFileName(card);
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
export async function shareResultCard(card: ShareCard, text: string): Promise<ShareOutcome> {
  const blob = await renderShareCard(card);
  const fileName = cardFileName(card);
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
