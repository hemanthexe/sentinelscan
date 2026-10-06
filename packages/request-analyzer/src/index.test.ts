import { describe, expect, it } from "vitest";
import { sanitizeUrl, classifyRequest } from "./index";
describe("request safety", () => {
  it("redacts sensitive query parameters", () =>
    expect(sanitizeUrl("https://x.test/a.m3u8?token=abc&foo=bar")).toBe(
      "https://x.test/a.m3u8?token=%5BREDACTED%5D&foo=bar",
    ));
  it("classifies segments", () =>
    expect(classifyRequest("https://x.test/seg-1.m4s")).toBe("segment"));
});
