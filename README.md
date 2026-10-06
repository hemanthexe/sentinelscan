# MediaSniff

Advanced HLS, MPEG-DASH and media-source inspection for developers.

MediaSniff is a privacy-first monorepo for inspecting media sources already exposed to a browser. It parses manifests locally, redacts sensitive URL parameters, and reports DRM metadata without extracting keys or bypassing protection.

## Features

- HLS master/media playlist parsing: variants, tracks, segments, live/VOD state and protection indicators.
- MPEG-DASH MPD parsing: adaptation sets, representations, timing and ContentProtection metadata.
- Direct media detection, request classification and safe URL/header sanitization.
- Responsive dark/light React dashboard with export-ready analysis data.
- Fastify REST API and a Manifest V3 Chrome extension for accessible page media.
- Offline fixtures and deterministic parser/security tests.

## Architecture

`packages/shared-types` contains the data contracts. `hls-parser`, `dash-parser`, `media-analyzer`, and `request-analyzer` are framework-independent packages reused by the web app, API, and extension. See [docs/architecture.md](docs/architecture.md).

## Installation and development

Requirements: Node.js 20+, pnpm 9+.

```bash
pnpm install
pnpm dev       # web on 5173 and API on 8787
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

Copy `.env.example` to `.env` to configure the API port. The web demo works offline with the bundled sample manifest; remote fetching is subject to browser CORS and authentication restrictions.

## Browser extension

Run `pnpm --filter @mediasniff/extension build`, then load `apps/extension/dist` as an unpacked extension in Chrome. The extension only observes media-like requests and DOM media elements permitted by browser APIs. It never records cookies, credentials, authorization headers, keys, or personal information.

## Supported formats

HLS (`.m3u8`) and MPEG-DASH (`.mpd`) manifests plus direct MP4, WebM, MOV, M4V and OGG sources. Large request collections should be fed to a host application using the shared request types so virtualization can be applied at the UI boundary.

## Security and privacy

All displayed/exported URLs are sanitized. Token-like query parameters and sensitive headers are replaced with `[REDACTED]`. DRM indicators are intentionally generic; MediaSniff does not retrieve keys, expose PSSH data, decrypt media, or bypass DRM. Analysis is local by default and no browsing history is sent to a remote service. Read [docs/security.md](docs/security.md) and [docs/privacy.md](docs/privacy.md).

## API

`GET /api/health`, `POST /api/analyze`, `POST /api/analyze/hls`, and `POST /api/analyze/dash`. Request bodies use `{ "url": "...", "content": "...", "contentType": "..." }`; responses contain sanitized URLs and structured analysis. See [docs/api.md](docs/api.md).

## Testing

Fixtures in `fixtures/` cover HLS VOD/live/master and static/dynamic DASH. Package tests are offline and do not contact third-party sites.

## Roadmap

Network waterfall ingestion, richer MPD segment timeline visualization, request virtualization, and optional DevTools panel integration.

## Contributing

Read [docs/contributing.md](docs/contributing.md), run the full validation suite, and keep changes privacy-preserving.

## License

MIT. See [LICENSE](LICENSE).
