import { describe, expect, it } from "vitest";
import { parseHls } from "./index";

describe("HLS parser", () => {
  it("parses variants and detects live playlists", () => {
    const result = parseHls(
      "#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=1280x720\n720.m3u8",
    );
    expect(result.variants[0]?.height).toBe(720);
    expect(result.isLive).toBe(true);
  });
  it("parses VOD segments", () => {
    const result = parseHls(
      "#EXTM3U\n#EXT-X-TARGETDURATION:6\n#EXTINF:6,\nsegment.ts\n#EXT-X-ENDLIST",
    );
    expect(result.isLive).toBe(false);
    expect(result.segments).toHaveLength(1);
  });
});
