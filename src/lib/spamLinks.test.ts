import { describe, expect, it } from "vitest";
import { normalizeSpamLink, duplicateSpamIds, buildPreparedDisavow } from "./spamLinks";

const entry = (id: string, link: string, status = "ready", duplicate_flag = false) => ({ id, link, status, duplicate_flag, created_at: `2026-11-09T00:00:0${id}Z` });
describe("spam link preparation", () => {
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