import { describe, expect, it } from "vitest";
import { sanitizeHeaders, sanitizeUrl, classifyRequest } from "./index";
describe("request safety", () => {
  it("redacts sensitive query parameters", () =>
    expect(sanitizeUrl("https://x.test/a.m3u8?token=abc&foo=bar")).toBe(
      "https://x.test/a.m3u8?token=%5BREDACTED%5D&foo=bar",
    ));
  it("classifies segments", () =>
    expect(classifyRequest("https://x.test/seg-1.m4s")).toBe("segment"));
  it("redacts URL credentials, fragments, and API-key headers", () => {
    expect(
      sanitizeUrl("https://user:password@example.test/a.m3u8#secret"),
    ).toBe(
      "https://%5BREDACTED%5D:%5BREDACTED%5D@example.test/a.m3u8#[REDACTED]",
    );
    expect(
      sanitizeHeaders({ "X-Api-Key": "secret", Accept: "video/mp4" }),
    ).toEqual({ "X-Api-Key": "[REDACTED]", Accept: "video/mp4" });
  });
});
