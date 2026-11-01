import { describe, expect, it } from "vitest";
import { mergeBadges, mergeExtras } from "./progressSync";

describe("progress merge", () => {
  it("keeps every badge from device and account, with the best score", () => {
    expect(mergeBadges({ a: 2, b: 4 }, { a: 4, c: 3 })).toEqual({ a: 4, b: 4, c: 3 });
  });
  it("keeps account certificate data when the device has none", () => {
    expect(mergeExtras({}, { "dh-cert-name": "Ana" })).toEqual({ "dh-cert-name": "Ana" });
  });
  it("prefers the device value when both exist", () => {
    expect(mergeExtras({ "dh-cert-name": "New" }, { "dh-cert-name": "Old" })).toEqual({ "dh-cert-name": "New" });
  });
});
