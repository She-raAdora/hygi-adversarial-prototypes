// Persisted header icon selection from public/splash assets.

export const HEADER_ICON_KEY = "hygi-header-icon";

export const DEFAULT_HEADER_ICON = null;

export const SPLASH_ICONS = [
  "splash-640x1136.png",
  "splash-750x1334.png",
  "splash-828x1792.png",
  "splash-1136x640.png",
  "splash-1334x750.png",
  "splash-1792x828.png",
  "splash-1125x2436.png",
  "splash-1170x2532.png",
  "splash-1179x2556.png",
  "splash-1242x2688.png",
  "splash-1284x2778.png",
  "splash-1290x2796.png",
  "splash-1536x2048.png",
  "splash-1620x2160.png",
  "splash-1668x2224.png",
  "splash-1668x2388.png",
  "splash-2048x1536.png",
  "splash-2048x2732.png",
  "splash-2160x1620.png",
  "splash-2224x1668.png",
  "splash-2388x1668.png",
  "splash-2436x1125.png",
  "splash-2532x1170.png",
  "splash-2556x1179.png",
  "splash-2688x1242.png",
  "splash-2732x2048.png",
  "splash-2778x1284.png",
  "splash-2796x1290.png",
];

export function getStoredHeaderIcon(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(HEADER_ICON_KEY);
}

export function setStoredHeaderIcon(filename: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HEADER_ICON_KEY, filename);
}

export function clearStoredHeaderIcon() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HEADER_ICON_KEY);
}

export function iconPath(filename: string): string {
  return `/splash/${filename}`;
}

export function iconLabel(filename: string): string {
  const m = filename.match(/splash-(\d+)x(\d+)\.png/);
  if (!m) return filename;
  return `${m[1]} × ${m[2]}`;
}
