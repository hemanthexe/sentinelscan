import type {
  HlsAnalysis,
  Segment,
  Track,
  Variant,
} from "@mediasniff/shared-types";

const attr = (line: string, key: string) => {
  const match = line.match(new RegExp(`${key}=("(?:[^"]*)"|[^,]*)`));
  return match?.[1]?.replace(/^"|"$/g, "");
};
const num = (value: string | undefined) =>
  value === undefined ? undefined : Number(value);
const codecs = (value: string | undefined) => value?.trim() || undefined;

export function parseHls(input: string): HlsAnalysis {
  if (!input.includes("#EXTM3U"))
    throw new Error("Invalid HLS playlist: missing #EXTM3U");
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const variants: Variant[] = [];
  const tracks: Track[] = [];
  const segments: Segment[] = [];
  let pendingVariant: Omit<Variant, "id"> | undefined;
  let targetDuration: number | undefined;
  let mediaSequence: number | undefined;
  let playlistType: string | undefined;
  let sequence = mediaSequence;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    if (line.startsWith("#EXT-X-STREAM-INF:")) {
      pendingVariant = {
        bandwidth: num(attr(line, "BANDWIDTH")),
        averageBandwidth: num(attr(line, "AVERAGE-BANDWIDTH")),
        width: num(attr(line, "RESOLUTION")?.split("x")[0]),
        height: num(attr(line, "RESOLUTION")?.split("x")[1]),
        frameRate: num(attr(line, "FRAME-RATE")),
        codecs: codecs(attr(line, "CODECS")),
        audioGroup: attr(line, "AUDIO"),
        subtitleGroup: attr(line, "SUBTITLES"),
      };
    } else if (pendingVariant && !line.startsWith("#")) {
      variants.push({
        ...pendingVariant,
        id: `variant-${variants.length + 1}`,
        uri: line,
      });
      pendingVariant = undefined;
    } else if (line.startsWith("#EXT-X-MEDIA:")) {
      const type = attr(line, "TYPE");
      if (type === "AUDIO" || type === "SUBTITLES")
        tracks.push({
          id: `track-${tracks.length + 1}`,
          type: type === "AUDIO" ? "audio" : "subtitle",
          language: attr(line, "LANGUAGE"),
          name: attr(line, "NAME"),
          uri: attr(line, "URI"),
          codecs: codecs(attr(line, "CODECS")),
        });
    } else if (line.startsWith("#EXT-X-TARGETDURATION:"))
      targetDuration = num(line.split(":")[1]);
    else if (line.startsWith("#EXT-X-MEDIA-SEQUENCE:")) {
      mediaSequence = num(line.split(":")[1]);
      sequence = mediaSequence;
    } else if (line.startsWith("#EXT-X-PLAYLIST-TYPE:"))
      playlistType = line.split(":")[1];
    else if (line.startsWith("#EXTINF:")) {
      const [durationText, ...title] = line.slice(8).split(",");
      const nextUri = lines[index + 1];
      if (nextUri && !nextUri.startsWith("#"))
        segments.push({
          uri: nextUri,
          duration: Number(durationText),
          sequence,
          title: title.join(",") || undefined,
        });
      if (sequence !== undefined) sequence += 1;
    }
  }
  return {
    type: "hls",
    isLive: !lines.includes("#EXT-X-ENDLIST") && playlistType !== "VOD",
    playlistType,
    version: num(
      lines.find((x) => x.startsWith("#EXT-X-VERSION:"))?.split(":")[1],
    ),
    targetDuration,
    mediaSequence,
    variants,
    tracks,
    segments,
    drm: {
      detected: lines.some((x) => /KEY|SESSION-KEY/i.test(x)),
      systems: [],
      encryption: lines.some((x) =>
        /KEYFORMAT="com\.apple\.streaming\.ll-hls"/i.test(x),
      )
        ? "HLS protection metadata"
        : undefined,
    },
  };
}
