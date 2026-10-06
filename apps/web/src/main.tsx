import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Copy,
  FileDown,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Waves,
} from "lucide-react";
import { analyzeMedia, detectType } from "@mediasniff/media-analyzer";
import { sanitizeUrl } from "@mediasniff/request-analyzer";
import type { Analysis } from "@mediasniff/shared-types";
import "./styles.css";

const demoHls =
  '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=6200000,RESOLUTION=1920x1080,FRAME-RATE=30,CODECS="avc1.640028,mp4a.40.2"\n1080p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2"\n720p.m3u8\n';
function App() {
  const [input, setInput] = useState(
    "https://cdn.example.test/master.m3u8?token=private",
  );
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("Overview");
  const type = analysis?.type ?? detectType(input);
  const stats = useMemo(
    () =>
      analysis?.type === "hls"
        ? {
            sources: 1,
            variants: analysis.variants.length,
            drm: analysis.drm.detected,
          }
        : analysis?.type === "dash"
          ? {
              sources: 1,
              variants: analysis.adaptations.reduce(
                (n, a) => n + a.representations.length,
                0,
              ),
              drm: analysis.drm.detected,
            }
          : { sources: analysis ? 1 : 0, variants: 0, drm: false },
    [analysis],
  );
  function inspect() {
    try {
      setError("");
      setAnalysis(
        analyzeMedia(input, input.includes(".m3u8") ? demoHls : undefined),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to analyze source");
    }
  }
  function exportJson() {
    if (!analysis) return;
    const blob = new Blob(
      [JSON.stringify({ url: sanitizeUrl(input), analysis }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mediasniff-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className={dark ? "app dark" : "app"}>
      <aside>
        <div className="brand">
          <span className="logo">
            <Waves size={18} />
          </span>
          <strong>MediaSniff</strong>
        </div>
        <p className="tagline">Inspect. Analyze. Understand.</p>
        <nav>
          {[
            "Dashboard",
            "Sources",
            "Requests",
            "Analyzer",
            "Reports",
            "Settings",
          ].map((item) => (
            <button
              className={tab === item ? "nav active" : "nav"}
              onClick={() => setTab(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="aside-foot">
          <ShieldCheck size={15} /> Local-first & privacy safe
        </div>
      </aside>
      <main>
        <header>
          <div>
            <span className="eyebrow">
              MEDIA INSPECTOR / {tab.toUpperCase()}
            </span>
            <h1>Understand every media stream.</h1>
            <p>
              Analyze HLS, MPEG-DASH and direct video sources without exposing
              credentials.
            </p>
          </div>
          <button
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <section className="hero-card">
          <label htmlFor="source">Media URL or manifest</label>
          <div className="input-row">
            <input
              id="source"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a .m3u8, .mpd, or video URL"
              onKeyDown={(e) => e.key === "Enter" && inspect()}
            />
            <button className="primary" onClick={inspect}>
              <Search size={16} /> Analyze
            </button>
            <button
              className="secondary"
              onClick={() => {
                setInput("");
                setAnalysis(null);
              }}
            >
              Clear
            </button>
          </div>
          <div className="hint">
            Try the offline HLS sample · Sensitive query parameters are always
            redacted
          </div>
          {error && <div className="error">{error}</div>}
        </section>
        <section className="stat-grid">
          <Stat label="Sources found" value={stats.sources} />
          <Stat label="Detected type" value={type.toUpperCase()} />
          <Stat label="Variants / reps" value={stats.variants} />
          <Stat label="Protection" value={stats.drm ? "Detected" : "None"} />
        </section>
        <section className="content-grid">
          <div className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">SOURCE ANALYSIS</span>
                <h2>
                  {analysis
                    ? `${type.toUpperCase()} source`
                    : "Ready to inspect"}
                </h2>
              </div>
              {analysis && (
                <button className="secondary" onClick={exportJson}>
                  <FileDown size={15} /> Export JSON
                </button>
              )}
            </div>
            {analysis?.type === "hls" && <HlsView analysis={analysis} />}{" "}
            {analysis?.type === "dash" && <DashView analysis={analysis} />}{" "}
            {analysis?.type === "direct" && (
              <div className="empty">
                <Activity />
                <p>
                  Direct media detected as{" "}
                  <b>{analysis.mimeType ?? analysis.extension ?? "video"}</b>.
                </p>
              </div>
            )}
            {!analysis && (
              <div className="empty">
                <Waves size={38} />
                <p>Paste a manifest or load a local sample to begin.</p>
                <button
                  className="secondary"
                  onClick={() => {
                    setInput("https://demo.local/master.m3u8");
                    setAnalysis(analyzeMedia("master.m3u8", demoHls));
                  }}
                >
                  Load sample manifest
                </button>
              </div>
            )}
          </div>
          <div className="panel side-panel">
            <span className="eyebrow">SAFE SOURCE</span>
            <h3>Redacted URL</h3>
            <code>{sanitizeUrl(input)}</code>
            <div className="security-note">
              <ShieldCheck size={16} />
              <span>
                Credentials, cookies, keys and auth tokens are never collected
                or exported.
              </span>
            </div>
            <h3 className="section-title">Quick links</h3>
            {[
              "Overview",
              "Video",
              "Audio",
              "Subtitles",
              "Variants",
              "Segments",
              "Requests",
              "Performance",
              "Security",
            ].map((item) => (
              <button
                className="quick-link"
                key={item}
                onClick={() => setTab(item)}
              >
                {item}
                <span>›</span>
              </button>
            ))}
          </div>
        </section>
        <footer>
          MediaSniff is a local-first developer tool. Protected content metadata
          may be inspected; DRM is never bypassed.
        </footer>
      </main>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function HlsView({
  analysis,
}: {
  analysis: Extract<Analysis, { type: "hls" }>;
}) {
  return (
    <>
      <div className="badges">
        <span className={analysis.isLive ? "badge live" : "badge"}>
          {analysis.isLive ? "LIVE" : "VOD"}
        </span>
        <span className="badge">HLS</span>
        {analysis.drm.detected && (
          <span className="badge warning">Protected metadata</span>
        )}
      </div>
      <div className="meta-grid">
        <div>
          <span>Target duration</span>
          <b>{analysis.targetDuration ?? "—"}s</b>
        </div>
        <div>
          <span>Playlist type</span>
          <b>{analysis.playlistType ?? (analysis.isLive ? "LIVE" : "VOD")}</b>
        </div>
        <div>
          <span>Segments</span>
          <b>{analysis.segments.length}</b>
        </div>
        <div>
          <span>Tracks</span>
          <b>{analysis.tracks.length}</b>
        </div>
      </div>
      <h3>Quality variants</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Quality</th>
              <th>Resolution</th>
              <th>Bitrate</th>
              <th>FPS</th>
              <th>Codec</th>
            </tr>
          </thead>
          <tbody>
            {analysis.variants.map((v) => (
              <tr key={v.id}>
                <td>{v.height ? `${v.height}p` : v.id}</td>
                <td>{v.width && v.height ? `${v.width}×${v.height}` : "—"}</td>
                <td>
                  {v.bandwidth ? `${(v.bandwidth / 1e6).toFixed(1)} Mbps` : "—"}
                </td>
                <td>{v.frameRate ?? "—"}</td>
                <td>{v.codecs ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function DashView({
  analysis,
}: {
  analysis: Extract<Analysis, { type: "dash" }>;
}) {
  return (
    <>
      <div className="badges">
        <span className={analysis.isLive ? "badge live" : "badge"}>
          {analysis.isLive ? "LIVE" : "STATIC"}
        </span>
        <span className="badge">MPEG-DASH</span>
        {analysis.drm.detected && (
          <span className="badge warning">Protected metadata</span>
        )}
      </div>
      <div className="meta-grid">
        <div>
          <span>Adaptation sets</span>
          <b>{analysis.adaptations.length}</b>
        </div>
        <div>
          <span>Representations</span>
          <b>
            {analysis.adaptations.reduce(
              (n, a) => n + a.representations.length,
              0,
            )}
          </b>
        </div>
        <div>
          <span>Duration</span>
          <b>{analysis.duration ?? "—"}</b>
        </div>
        <div>
          <span>Update period</span>
          <b>{analysis.minimumUpdatePeriod ?? "—"}</b>
        </div>
      </div>
      {analysis.adaptations.map((a) => (
        <div className="adaptation" key={a.id ?? a.contentType}>
          <b>{a.contentType ?? a.mimeType ?? "Adaptation set"}</b>
          <span>
            {a.lang ?? "und"} · {a.representations.length} representations
          </span>
        </div>
      ))}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
