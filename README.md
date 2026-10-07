# SentinelScan

SentinelScan is a standalone, authorized web security assessment workspace for security and platform teams.

## Current vertical slice

- Enterprise security operations dashboard with posture trend and risk metrics
- Target and authorized scope setup
- Scan profiles with an explicit authorization gate
- Scan history and run status
- Asset and endpoint inventory
- Findings prioritized by severity and confidence
- Evidence, OWASP mapping, remediation guidance, and triage drawer
- Executive reports, integrations, CI/CD and REST API entry points
- Responsive dark workspace UI

The current release keeps assessment data in `apps/web/src/sentinel-data.ts` so the product remains deterministic and safe to demo while the backend contract is finalized. No network scanning, credential collection, exploitation, or unauthorised testing is implemented.

## Development

Requirements: Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The Vite dashboard runs on port 5173 by default. This repository is intentionally focused on authorized web security assessment and contains no unrelated media or browser-extension functionality.

## Authorization and safety

SentinelScan is designed for assets where the operator has explicit permission to test. The UI requires scope confirmation before a scan can be started. Any future active assessment implementation must enforce the same authorization boundary server-side, maintain audit logs, rate-limit checks, and provide an emergency stop.

## License

MIT. See [LICENSE](LICENSE).
