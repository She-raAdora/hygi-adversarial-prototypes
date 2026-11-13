import { describe, expect, it } from "vitest";
import { normalizeSpamLink, duplicateSpamIds, buildPreparedDisavow, prepareSpamReport, flaggedDomainEntries, preparedDisavowDomains, preparedDisavowLines } from "./spamLinks";

const entry = (id: string, link: string, status = "ready", duplicate_flag = false) => ({ id, link, status, duplicate_flag, created_at: `2026-11-09T00:00:0${id}Z` });
describe("spam link preparation", () => {
  it("records the same flagged domains as the blocker file without requiring a Semrush snapshot", () => {
    const reports = flaggedDomainEntries([
      { ...entry("1", "PHISH.example"), threat_category: "phishing" },
      { ...entry("2", "domain:phish.example"), threat_category: "phishing" },
      { ...entry("3", "malware.example", "ready", true), threat_category: "malware" },
      { ...entry("4", "review.example", "review"), threat_category: "scams" },
      { ...entry("5", "excluded.example", "excluded"), threat_category: "scams" },
      { ...entry("6", "scam.example"), threat_category: "scams" },
    ]);
    expect(preparedDisavowDomains(reports)).toEqual(["phish.example", "scam.example"]);
    expect(preparedDisavowLines(reports)).toEqual(preparedDisavowDomains(reports).map((domain) => `domain:${domain}`));
  });
  it("counts only explicit domain lines in mixed manager files without broadening URL scope", () => {
    const reports = [entry("1", "spam.example"), entry("2", "https://page.example/specific")];
    expect(preparedDisavowDomains(reports)).toEqual(["spam.example"]);
    expect(preparedDisavowLines(reports)).toEqual(["domain:spam.example", "https://page.example/specific"]);
  });
  it("builds the blocker file from flagged domains without broadening URL reports", () => {
    const reports = [
      { ...entry("1", "phish.example"), threat_category: "phishing" },
      { ...entry("2", "malware.example"), threat_category: "malware" },
      { ...entry("3", "scam.example"), threat_category: "scams" },
      { ...entry("4", "https://page.example/specific"), threat_category: "malware" },
      { ...entry("5", "unflagged.example"), threat_category: null },
    ];
    expect(buildPreparedDisavow(flaggedDomainEntries(reports))).toBe("# Prepared spam links for digitalhygiene.app\ndomain:malware.example\ndomain:phish.example\ndomain:scam.example\n");
  });
  for (const threat_category of ["phishing", "malware", "scams"]) it(`automatically includes ${threat_category} reports in prepared output`, () => {
    const report = prepareSpamReport({ link: "https://spam.example/report", threat_category });
    expect(report.threat_category).toBe(threat_category);
    expect(buildPreparedDisavow([{ ...entry("1", report.link), status: report.status }])).toContain("\nhttps://spam.example/report\n");
  });
  it("rejects unknown threat flags and oversized links", () => {
    expect(() => prepareSpamReport({ link: "spam.example", threat_category: "other" })).toThrow();
    expect(() => prepareSpamReport({ link: "https://spam.example/" + "a".repeat(2048), threat_category: "scams" })).toThrow();
  });
  it("flags equivalent domains and URLs while preserving originals", () => {
    expect([...duplicateSpamIds([entry("1", "SPAM.example"), entry("2", "domain:spam.example"), entry("3", "https://spam.example/a#x"), entry("4", "https://SPAM.example/a#y")])]).toEqual(["2", "4"]);
  });
  it("does not merge different paths, queries, protocols or domain scope", () => {
    expect(duplicateSpamIds([entry("1", "https://spam.example/a"), entry("2", "https://spam.example/b"), entry("3", "https://spam.example/a?x=1"), entry("4", "http://spam.example/a"), entry("5", "spam.example")]).size).toBe(0);
  });
  it("excludes flagged duplicates, automatic duplicates, review and excluded entries", () => {
    expect(buildPreparedDisavow([entry("1", "spam.example"), entry("2", "spam.example"), entry("3", "other.example", "ready", true), entry("4", "review.example", "review"), entry("5", "excluded.example", "excluded")])).toBe("# Prepared spam links for digitalhygiene.app\ndomain:spam.example\n");
  });
  it("exports a specific URL without disavowing its whole domain", () => {
    expect(buildPreparedDisavow([entry("1", "https://spam.example/path")])).toContain("\nhttps://spam.example/path\n");
  });
  it("rejects unsafe or malformed inputs", () => {
    for (const value of ["javascript:alert(1)", "https://user:pass@spam.example/a", "bad domain", "domain:spam.example/path"]) expect(() => normalizeSpamLink(value)).toThrow();
  });
});