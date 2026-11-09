import { z } from "zod";

export type SpamEntry = { id: string; link: string; status: string; duplicate_flag: boolean; created_at: string };

export const spamReportSchema = z.object({
  link: z.string().trim().min(1).max(2048).refine((value) => {
    try { normalizeSpamLink(value); return !/\s/.test(value); } catch { return false; }
  }, "Enter a valid domain or full http/https link."),
  threat_category: z.enum(["phishing", "malware", "scams"]),
});

export function prepareSpamReport(input: unknown) {
  const report = spamReportSchema.parse(input);
  return { ...report, normalized_link: normalizeSpamLink(report.link), status: "ready" as const };
}

export function normalizeSpamLink(input: string): string {
  const value = input.trim();
  if (/^domain:/i.test(value) || !value.includes("://") && !value.includes("/")) {
    const domain = value.replace(/^domain:/i, "").toLowerCase();
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new Error(`Invalid domain: ${value}`);
    return `domain:${domain}`;
  }
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`Enter a full http or https link: ${value}`); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !url.hostname.includes(".")) throw new Error(`Invalid link: ${value}`);
  url.hash = "";
  return url.href;
}

export function duplicateSpamIds(entries: SpamEntry[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of [...entries].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))) {
    const normalized = normalizeSpamLink(entry.link);
    if (seen.has(normalized)) duplicates.add(entry.id);
    seen.add(normalized);
  }
  return duplicates;
}

export function buildPreparedDisavow(entries: SpamEntry[]): string {
  const duplicates = duplicateSpamIds(entries);
  const lines = entries.filter((entry) => entry.status === "ready" && !entry.duplicate_flag && !duplicates.has(entry.id)).map((entry) => normalizeSpamLink(entry.link));
  if (lines.length === 0) throw new Error("No ready, unflagged entries to download.");
  return "# Prepared spam links for digitalhygiene.app\n" + [...new Set(lines)].sort().join("\n") + "\n";
}