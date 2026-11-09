import { describe, expect, it } from "vitest";
import { buildDisavowFile, summarizeDisavowUploads, disavowTypeBreakdown } from "./disavow";

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
      { month: "2026-10", submitted: 10, accepted: 8, rejected: 0, pending: 2 },
      { month: "2026-11", submitted: 15, accepted: 12, rejected: 0, pending: 3 },
    ]);
  });
  it("shows zero totals without fabricating upload history", () => {
    expect(summarizeDisavowUploads([])).toEqual({ latest: { submitted: 0, accepted: 0, rejected: 0, pending: 0 }, monthly: [] });
  });
});


describe("individual domain status counts", () => {
  it("breaks down recorded types without classifying unknown domains or mixing statuses", () => {
    const result = disavowTypeBreakdown({ uploaded_at: "2026-11-09", domains_selected: 4, domains_accepted: 0, disavow_domain_statuses: [
      { id: "1", domain: "a.example", status: "accepted", updated_at: "2026-11-09", threat_category: "phishing" },
      { id: "2", domain: "b.example", status: "pending", updated_at: "2026-11-09", threat_category: "malware" },
      { id: "3", domain: "c.example", status: "rejected", updated_at: "2026-11-09", threat_category: "scams" },
      { id: "4", domain: "d.example", status: "pending", updated_at: "2026-11-09" },
    ] });
    expect(result).toEqual([
      { type: "phishing", submitted: 1, accepted: 1, pending: 0, rejected: 0 },
      { type: "malware", submitted: 1, accepted: 0, pending: 1, rejected: 0 },
      { type: "scams", submitted: 1, accepted: 0, pending: 0, rejected: 1 },
      { type: "unclassified", submitted: 1, accepted: 0, pending: 1, rejected: 0 },
    ]);
  });
  const upload = {
    uploaded_at: "2026-11-09T05:00:00Z", domains_selected: 3, domains_accepted: 3,
    disavow_domain_statuses: [
      { id: "a", domain: "a.example", status: "accepted", updated_at: "2026-11-09" },
      { id: "b", domain: "b.example", status: "pending", updated_at: "2026-11-09" },
      { id: "c", domain: "c.example", status: "rejected", updated_at: "2026-11-09" },
    ],
  };
  it("counts accepted domains from statuses rather than a legacy count", () => {
    expect(summarizeDisavowUploads([upload]).latest.accepted).toBe(1);
  });
  it("does not count rejected domains as pending", () => {
    expect(summarizeDisavowUploads([upload]).latest).toEqual({ submitted: 3, accepted: 1, pending: 1, rejected: 1 });
  });
  it("updates the monthly trend from individual statuses", () => {
    expect(summarizeDisavowUploads([upload]).monthly).toEqual([{ month: "2026-11", submitted: 3, accepted: 1, pending: 1, rejected: 1 }]);
  });
  it("keeps newly recorded domains pending without inferring identities from old counts", () => {
    const pendingUpload = { ...upload, disavow_domain_statuses: upload.disavow_domain_statuses.map((row) => ({ ...row, status: "pending" })) };
    expect(summarizeDisavowUploads([pendingUpload]).latest).toEqual({ submitted: 3, accepted: 0, pending: 3, rejected: 0 });
  });
});
