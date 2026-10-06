import { XMLParser } from "fast-xml-parser";
import type {
  DashAdaptationSet,
  DashAnalysis,
  DashRepresentation,
} from "@mediasniff/shared-types";
const arr = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];
const n = (v: unknown) =>
  typeof v === "number" ? v : typeof v === "string" ? Number(v) : undefined;
export function parseDash(input: string): DashAnalysis {
  const parsed = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  }).parse(input) as { MPD?: Record<string, unknown> };
  const mpd = parsed.MPD;
  if (!mpd) throw new Error("Invalid DASH manifest: missing MPD");
  const adaptations: DashAdaptationSet[] = [];
  let drmDetected = false;
  for (const period of arr(
    mpd.Period as
      Record<string, unknown> | Record<string, unknown>[] | undefined,
  )) {
    for (const set of arr(
      period.AdaptationSet as
        Record<string, unknown> | Record<string, unknown>[] | undefined,
    )) {
      const protections = arr(set.ContentProtection as unknown | unknown[]);
      if (protections.length) drmDetected = true;
      const reps: DashRepresentation[] = arr(
        set.Representation as
          Record<string, unknown> | Record<string, unknown>[] | undefined,
      ).map((rep, i) => ({
        id: String(rep["@_id"] ?? `representation-${i + 1}`),
        bandwidth: n(rep["@_bandwidth"]),
        width: n(rep["@_width"] ?? set["@_width"]),
        height: n(rep["@_height"] ?? set["@_height"]),
        frameRate:
          String(rep["@_frameRate"] ?? set["@_frameRate"] ?? "") || undefined,
        codecs: String(rep["@_codecs"] ?? set["@_codecs"] ?? "") || undefined,
        mimeType:
          String(rep["@_mimeType"] ?? set["@_mimeType"] ?? "") || undefined,
        audioSamplingRate: n(
          rep["@_audioSamplingRate"] ?? set["@_audioSamplingRate"],
        ),
        audioChannels: n(
          (
            rep.AudioChannelConfiguration as Record<string, unknown> | undefined
          )?.["@_value"],
        ),
      }));
      adaptations.push({
        id: set["@_id"] as string | undefined,
        contentType: set["@_contentType"] as string | undefined,
        mimeType: set["@_mimeType"] as string | undefined,
        lang: set["@_lang"] as string | undefined,
        codecs: set["@_codecs"] as string | undefined,
        representations: reps,
      });
    }
  }
  return {
    type: "dash",
    isLive: mpd["@_type"] === "dynamic",
    duration: n(mpd["@_mediaPresentationDuration"]),
    minimumUpdatePeriod: n(mpd["@_minimumUpdatePeriod"]),
    timeShiftBufferDepth: n(mpd["@_timeShiftBufferDepth"]),
    adaptations,
    drm: {
      detected: drmDetected,
      systems: [],
      encryption: drmDetected
        ? "Common Encryption metadata exposed"
        : undefined,
    },
  };
}
