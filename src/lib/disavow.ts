/** Build a Google disavow file (one `domain:` line per site, `#` comments allowed). */
export function buildDisavowFile(domains: string[], note: string, date: string): string {
  const unique = Array.from(
    new Set(
      domains
        .map((d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""))
        .filter(Boolean),
    ),
  ).sort();
  const comments = note
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `# ${l}`);
  return [...comments, `# Generated ${date}`, ...unique.map((d) => `domain:${d}`)].join("\n") + "\n";
}

type UploadCounts = { uploaded_at: string; domains_selected: number; domains_accepted: number };

/** Replacement uploads are snapshots, not additive domain counts. */
export function summarizeDisavowUploads(uploads: UploadCounts[]) {
  const sorted = [...uploads].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
  const counts = (upload?: UploadCounts) => ({
    submitted: upload?.domains_selected ?? 0,
    accepted: upload?.domains_accepted ?? 0,
    pending: Math.max(0, (upload?.domains_selected ?? 0) - (upload?.domains_accepted ?? 0)),
  });
  const months = new Map<string, UploadCounts>();
  for (const upload of sorted) {
    const month = upload.uploaded_at.slice(0, 7);
    if (!months.has(month)) months.set(month, upload);
  }
  return {
    latest: counts(sorted[0]),
    monthly: [...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, upload]) => ({ month, ...counts(upload) })),
  };
}
