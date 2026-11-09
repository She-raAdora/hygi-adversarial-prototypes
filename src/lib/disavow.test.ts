import { describe, expect, it } from "vitest";
import { buildDisavowFile, summarizeDisavowUploads } from "./disavow";

describe("buildDisavowFile", () => {
  it("writes one domain line per site, deduped and cleaned", () => {
    const out = buildDisavowFile(["https://www.Polva.shop/x", "polva.shop", "linkalchemy.xyz"], "Spam links", "2026-10-28");
    expect(out).toBe("# Spam links\n# Generated 2026-10-28\ndomain:linkalchemy.xyz\ndomain:polva.shop\n");
  });
});

describe("disavow dashboard", () => {
  const uploads = [
    { uploaded_at: "2026-10-01T12:00:00Z", domains_selected: 10, domains_accepted: 8 },
    { uploaded_at: "2026-11-02T12:00:00Z", domains_selected: 15, domains_accepted: 12 },
    { uploaded_at: "2026-11-01T12:00:00Z", domains_selected: 14, domains_accepted: 10 },
  ];
  it("uses the latest replacement file rather than double-counting submissions", () => {
    expect(summarizeDisavowUploads(uploads).latest.submitted).toBe(15);
  });
  it("shows recorded accepted domains from the latest file", () => {
    expect(summarizeDisavowUploads(uploads).latest.accepted).toBe(12);
  });
  it("counts pending confirmation as submitted minus accepted", () => {
    expect(summarizeDisavowUploads(uploads).latest.pending).toBe(3);
  });
  it("uses the last upload in each month in chronological order", () => {
    expect(summarizeDisavowUploads(uploads).monthly).toEqual([
      { month: "2026-10", submitted: 10, accepted: 8, pending: 2 },
      { month: "2026-11", submitted: 15, accepted: 12, pending: 3 },
    ]);
  });
  it("shows zero totals without fabricating upload history", () => {
    expect(summarizeDisavowUploads([])).toEqual({ latest: { submitted: 0, accepted: 0, pending: 0 }, monthly: [] });
  });
});
