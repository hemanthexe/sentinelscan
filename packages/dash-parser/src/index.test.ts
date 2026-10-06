import { describe, expect, it } from "vitest";
import { parseDash } from "./index";

describe("DASH parser", () => {
  it("parses representations and protection metadata", () => {
    const result = parseDash(
      '<MPD type="dynamic"><Period><AdaptationSet contentType="video"><ContentProtection schemeIdUri="cenc"/><Representation id="v1" width="1920" height="1080" bandwidth="5000000"/></AdaptationSet></Period></MPD>',
    );
    expect(result.isLive).toBe(true);
    expect(result.adaptations[0]?.representations[0]?.width).toBe(1920);
    expect(result.drm.detected).toBe(true);
  });
});
