export type Severity = "Critical" | "High" | "Medium" | "Low";
export type ScanStatus = "Completed" | "Running" | "Queued";

export interface Target {
  id: string;
  name: string;
  url: string;
  environment: "Production" | "Staging" | "Development";
  owner: string;
  scope: string;
  lastScan: string;
  status: "Healthy" | "Attention" | "Monitoring";
}

export interface Scan {
  id: string;
  target: string;
  profile: string;
  started: string;
  duration: string;
  status: ScanStatus;
  findings: number;
  score: number;
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  confidence: number;
  asset: string;
  category: string;
  owasp: string;
  evidence: string;
  remediation: string;
  discovered: string;
}

export const targets: Target[] = [
  {
    id: "t-001",
    name: "Acme customer portal",
    url: "https://portal.acme.test",
    environment: "Production",
    owner: "Platform team",
    scope: "portal.acme.test, api.acme.test",
    lastScan: "12 min ago",
    status: "Attention",
  },
  {
    id: "t-002",
    name: "Acme commerce API",
    url: "https://api.acme.test",
    environment: "Staging",
    owner: "Commerce team",
    scope: "api.acme.test/v1/*",
    lastScan: "Yesterday",
    status: "Healthy",
  },
  {
    id: "t-003",
    name: "Acme mobile gateway",
    url: "https://gateway.acme.test",
    environment: "Production",
    owner: "Mobile team",
    scope: "gateway.acme.test",
    lastScan: "3 days ago",
    status: "Monitoring",
  },
];

export const scans: Scan[] = [
  {
    id: "scan-842",
    target: "Acme customer portal",
    profile: "Authenticated deep scan",
    started: "Today, 09:42",
    duration: "18m 24s",
    status: "Completed",
    findings: 14,
    score: 78,
  },
  {
    id: "scan-841",
    target: "Acme commerce API",
    profile: "API baseline",
    started: "Yesterday, 16:10",
    duration: "7m 08s",
    status: "Completed",
    findings: 4,
    score: 92,
  },
  {
    id: "scan-840",
    target: "Acme mobile gateway",
    profile: "Passive discovery",
    started: "Oct 04, 12:22",
    duration: "4m 51s",
    status: "Completed",
    findings: 7,
    score: 86,
  },
];

export const findings: Finding[] = [
  {
    id: "FND-1042",
    title: "Reflected input rendered without context encoding",
    severity: "High",
    confidence: 96,
    asset: "portal.acme.test / search",
    category: "Injection",
    owasp: "A03:2021",
    evidence: "GET /search?q=sentinel%22%3E%3Csvg%20onload%3Dalert(1)%3E",
    remediation:
      "Apply context-aware output encoding and use a strict Content-Security-Policy.",
    discovered: "12 min ago",
  },
  {
    id: "FND-1041",
    title: "Missing rate limit on password reset",
    severity: "Medium",
    confidence: 91,
    asset: "api.acme.test / v1/auth/reset",
    category: "Abuse controls",
    owasp: "A04:2021",
    evidence: "120 requests accepted in 60 seconds from a single session.",
    remediation:
      "Add a per-account and per-IP throttle with exponential backoff and alerting.",
    discovered: "15 min ago",
  },
  {
    id: "FND-1039",
    title: "TLS configuration allows legacy cipher suite",
    severity: "Low",
    confidence: 99,
    asset: "gateway.acme.test / 443",
    category: "Configuration",
    owasp: "A05:2021",
    evidence: "TLS_RSA_WITH_AES_128_CBC_SHA negotiated during handshake.",
    remediation:
      "Remove legacy RSA key exchange and CBC suites from the edge policy.",
    discovered: "19 min ago",
  },
  {
    id: "FND-1038",
    title: "Verbose server header discloses framework version",
    severity: "Low",
    confidence: 98,
    asset: "portal.acme.test /",
    category: "Information disclosure",
    owasp: "A05:2021",
    evidence: "Server: nginx/1.24.0 and X-Powered-By: Express.",
    remediation:
      "Remove framework-identifying response headers at the edge and app layer.",
    discovered: "22 min ago",
  },
];

export const postureHistory = [
  { label: "Sep 09", score: 66 },
  { label: "Sep 16", score: 71 },
  { label: "Sep 23", score: 69 },
  { label: "Sep 30", score: 76 },
  { label: "Oct 07", score: 78 },
];

export const assets = [
  {
    name: "portal.acme.test",
    type: "Web application",
    endpoints: 84,
    exposure: "Internet-facing",
    lastSeen: "12 min ago",
  },
  {
    name: "api.acme.test",
    type: "REST API",
    endpoints: 142,
    exposure: "Internet-facing",
    lastSeen: "15 min ago",
  },
  {
    name: "gateway.acme.test",
    type: "API gateway",
    endpoints: 38,
    exposure: "Internet-facing",
    lastSeen: "19 min ago",
  },
  {
    name: "admin.acme.test",
    type: "Admin console",
    endpoints: 26,
    exposure: "Restricted",
    lastSeen: "3 days ago",
  },
];

export const scanProfiles = [
  {
    name: "Passive discovery",
    detail: "Safe asset and endpoint inventory",
    duration: "5–10 min",
    tone: "safe",
  },
  {
    name: "API baseline",
    detail: "Authenticated API behavior and controls",
    duration: "10–20 min",
    tone: "standard",
  },
  {
    name: "Authenticated deep scan",
    detail: "Full approved scope with safe checks",
    duration: "20–45 min",
    tone: "deep",
  },
];
