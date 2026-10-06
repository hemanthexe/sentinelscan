# API

The Fastify service defaults to port 8787.

- `GET /api/health`
- `POST /api/analyze`
- `POST /api/analyze/hls`
- `POST /api/analyze/dash`

All manifest bodies are supplied explicitly by the caller. URL fields are sanitized in responses. Invalid input returns 400; malformed/unsupported manifests return 422.
