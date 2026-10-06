export type MediaType = "hls" | "dash" | "direct" | "unknown";
export type StreamKind =
  | "manifest"
  | "playlist"
  | "segment"
  | "initialization"
  | "audio"
  | "video"
  | "subtitle"
  | "other";
export interface Variant {
  id: string;
  bandwidth?: number;
  averageBandwidth?: number;
  width?: number;
  height?: number;
  frameRate?: number;
  codecs?: string;
  uri?: string;
  audioGroup?: string;
  subtitleGroup?: string;
}
export interface Track {
  id: string;
  type: "audio" | "subtitle" | "video";
  language?: string;
  name?: string;
  codecs?: string;
  mimeType?: string;
  channels?: number;
  sampleRate?: number;
  uri?: string;
}
export interface Segment {
  uri: string;
  duration?: number;
  sequence?: number;
  title?: string;
}
export interface DrmInfo {
  detected: boolean;
  systems: string[];
  encryption?: string;
}
export interface HlsAnalysis {
  type: "hls";
  isLive: boolean;
  playlistType?: string;
  version?: number;
  targetDuration?: number;
  mediaSequence?: number;
  variants: Variant[];
  tracks: Track[];
  segments: Segment[];
  drm: DrmInfo;
}
export interface DashRepresentation {
  id: string;
  bandwidth?: number;
  width?: number;
  height?: number;
  frameRate?: string;
  codecs?: string;
  mimeType?: string;
  audioSamplingRate?: number;
  audioChannels?: number;
}
export interface DashAdaptationSet {
  id?: string;
  contentType?: string;
  mimeType?: string;
  lang?: string;
  codecs?: string;
  representations: DashRepresentation[];
}
export interface DashAnalysis {
  type: "dash";
  isLive: boolean;
  duration?: number;
  minimumUpdatePeriod?: number;
  timeShiftBufferDepth?: number;
  adaptations: DashAdaptationSet[];
  drm: DrmInfo;
}
export interface DirectAnalysis {
  type: "direct";
  mimeType?: string;
  extension?: string;
}
export type Analysis = HlsAnalysis | DashAnalysis | DirectAnalysis;
export interface Source {
  id: string;
  url: string;
  safeUrl: string;
  type: MediaType;
  host: string;
  status?: number;
  contentType?: string;
  analysis?: Analysis;
  error?: string;
}
export interface MediaRequest {
  id: string;
  url: string;
  safeUrl: string;
  method: string;
  status?: number;
  size?: number;
  durationMs?: number;
  startedAt: number;
  kind: StreamKind;
  contentType?: string;
}
