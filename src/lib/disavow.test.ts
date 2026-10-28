import { describe, expect, it } from "vitest";
import { buildDisavowFile } from "./disavow";

describe("buildDisavowFile", () => {
  it("writes one domain line per site, deduped and cleaned", () => {
    const out = buildDisavowFile(["https://www.Polva.shop/x", "polva.shop", "linkalchemy.xyz"], "Spam links", "2026-10-28");
    expect(out).toBe("# Spam links\n# Generated 2026-10-28\ndomain:linkalchemy.xyz\ndomain:polva.shop\n");
  });
});
