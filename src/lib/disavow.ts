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

export type DomainStatus = { id: string; domain: string; status: string; updated_at: string; threat_category?: string | null };
export type DisavowUpload = { id: string; uploaded_at: string; domains_selected: number; domains_accepted: number; disavow_domain_statuses: DomainStatus[] };
type UploadCounts = { uploaded_at: string; domains_selected: number; domains_accepted: number; disavow_domain_statuses?: DomainStatus[] };

export function disavowCounts(upload?: UploadCounts) {
  const rows = upload?.disavow_domain_statuses;
  if (rows?.length) {
    const accepted = rows.filter((row) => row.status === "accepted").length;
    const rejected = rows.filter((row) => row.status === "rejected").length;
    const submitted = Math.max(upload?.domains_selected ?? 0, rows.length);
    return { submitted, accepted, rejected, pending: submitted - accepted - rejected };
  }
  return {
    submitted: upload?.domains_selected ?? 0,
    accepted: upload?.domains_accepted ?? 0,
    rejected: 0,
    pending: Math.max(0, (upload?.domains_selected ?? 0) - (upload?.domains_accepted ?? 0)),
  };
}

/** Replacement uploads are snapshots, not additive domain counts. */
export function summarizeDisavowUploads(uploads: UploadCounts[]) {
  const sorted = [...uploads].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
  const months = new Map<string, UploadCounts>();
  for (const upload of sorted) {
    const month = upload.uploaded_at.slice(0, 7);
    if (!months.has(month)) months.set(month, upload);
  }
  return {
    latest: disavowCounts(sorted[0]),
    monthly: [...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, upload]) => ({ month, ...disavowCounts(upload) })),
  };
}

export function disavowTypeBreakdown(upload?: UploadCounts) {
  return ["phishing", "malware", "scams", "unclassified"].map((type) => {
    const rows = (upload?.disavow_domain_statuses ?? []).filter((row) => (["phishing", "malware", "scams"].includes(row.threat_category ?? "") ? row.threat_category : "unclassified") === type);
    return { type, submitted: rows.length, accepted: rows.filter((row) => row.status === "accepted").length, pending: rows.filter((row) => row.status === "pending").length, rejected: rows.filter((row) => row.status === "rejected").length };
  });
}
