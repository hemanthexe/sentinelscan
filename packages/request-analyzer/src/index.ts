import type { MediaRequest, StreamKind } from "@mediasniff/shared-types";
export const sensitive =
  /^(token|auth|authorization|signature|sig|key|secret|access_token|session|credential|cookie|set-cookie)$/i;
export function sanitizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    for (const key of [...url.searchParams.keys()])
      if (sensitive.test(key)) url.searchParams.set(key, "[REDACTED]");
    return url.toString();
  } catch {
    return "[INVALID URL]";
  }
}
export function sanitizeHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      sensitive.test(key) ? "[REDACTED]" : value,
    ]),
  );
}
export function classifyRequest(url: string, contentType?: string): StreamKind {
  const value = `${url} ${contentType ?? ""}`.toLowerCase();
  if (value.includes(".m3u8"))
    return value.includes("playlist") ? "playlist" : "manifest";
  if (value.includes(".mpd")) return "manifest";
  if (value.includes(".m4s") || value.includes(".ts")) return "segment";
  if (value.includes("subtitle") || value.includes("text/vtt"))
    return "subtitle";
  if (value.includes("audio")) return "audio";
  if (value.includes("video")) return "video";
  return "other";
}
export function toRequest(input: {
  url: string;
  method?: string;
  status?: number;
  size?: number;
  durationMs?: number;
  startedAt?: number;
  contentType?: string;
}): MediaRequest {
  return {
    id: crypto.randomUUID(),
    url: input.url,
    safeUrl: sanitizeUrl(input.url),
    method: input.method ?? "GET",
    status: input.status,
    size: input.size,
    durationMs: input.durationMs,
    startedAt: input.startedAt ?? Date.now(),
    kind: classifyRequest(input.url, input.contentType),
    contentType: input.contentType,
  };
}
