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
