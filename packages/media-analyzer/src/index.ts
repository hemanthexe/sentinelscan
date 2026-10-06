import { parseDash } from "@mediasniff/dash-parser";
import { parseHls } from "@mediasniff/hls-parser";
import type { Analysis, MediaType } from "@mediasniff/shared-types";
export function detectType(
  url: string,
  body?: string,
  contentType?: string,
): MediaType {
  const value = `${url} ${contentType ?? ""}`.toLowerCase();
  if (value.includes(".m3u8") || body?.includes("#EXTM3U")) return "hls";
  if (value.includes(".mpd") || body?.includes("<MPD")) return "dash";
  if (
    /\.(mp4|webm|mov|m4v|ogg)(?:$|[?#])/.test(value) ||
    contentType?.startsWith("video/")
  )
    return "direct";
  return "unknown";
}
export function analyzeMedia(
  url: string,
  body?: string,
  contentType?: string,
): Analysis {
  const type = detectType(url, body, contentType);
  if (type === "hls" && body) return parseHls(body);
  if (type === "dash" && body) return parseDash(body);
  if (type === "direct")
    return {
      type: "direct",
      mimeType: contentType,
      extension: url.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1],
    };
  throw new Error("Unsupported or unavailable media source");
}
