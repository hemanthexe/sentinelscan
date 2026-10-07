import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Cloud,
  FileText,
  Filter,
  GitBranch,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  Play,
  Plus,
  Radar,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Target,
  TerminalSquare,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  assets,
  findings,
  postureHistory,
  scanProfiles,
  scans,
  targets,
  type Finding,
  type Severity,
} from "./sentinel-data";
import "./styles.css";

type Tab = "Overview" | "Targets" | "Scans" | "Assets" | "Findings" | "Reports";

const navigation: { label: Tab; icon: React.ElementType }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Targets", icon: Target },
  { label: "Scans", icon: Radar },
  { label: "Assets", icon: Network },
  { label: "Findings", icon: AlertTriangle },
  { label: "Reports", icon: FileText },
];

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [dark, setDark] = useState(true);
  const [showScan, setShowScan] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [query, setQuery] = useState("");

  const filteredFindings = useMemo(
    () =>
      findings.filter((finding) =>
        `${finding.title} ${finding.asset} ${finding.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <ShieldCheck size={19} />
          </span>
          <span>
            <strong>SentinelScan</strong>
            <small>SECURITY OPERATIONS</small>
          </span>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">AC</span>
          <span>
            <b>Acme Corporation</b>
            <small>Security workspace</small>
          </span>
          <ChevronRight size={14} />
        </div>
        <nav className="main-nav">
          <span className="nav-label">Workspace</span>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={tab === label ? "nav-item active" : "nav-item"}
              key={label}
              onClick={() => setTab(label)}
            >
              <Icon size={17} /> {label}
              {label === "Findings" && <span className="nav-count">14</span>}
            </button>
          ))}
        </nav>
        <nav className="main-nav nav-secondary">
          <span className="nav-label">Manage</span>
          <button className="nav-item" onClick={() => setTab("Targets")}>
            <GitBranch size={17} /> Integrations
          </button>
          <button className="nav-item" onClick={() => setTab("Reports")}>
            <Settings2 size={17} /> Settings
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="compliance-card">
            <LockKeyhole size={16} />
            <span>
              <b>Authorized testing only</b>
              <small>Scope gate is enabled</small>
            </span>
            <Check size={14} />
          </div>
          <button className="user-row">
            <span className="user-avatar">JD</span>
            <span>
              <b>Jordan Davis</b>
              <small>Security lead</small>
            </span>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand">
            <Menu size={19} />
            <b>SentinelScan</b>
          </div>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <b>{tab}</b>
          </div>
          <div className="top-actions">
            <span className="live-status">
              <i /> All systems operational
            </span>
            <button
              className="icon-button"
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="help-button">
              <CircleHelp size={16} /> Help
            </button>
          </div>
        </header>

        <div className="page">
          {tab === "Overview" && (
            <Overview
              onScan={() => setShowScan(true)}
              onFindings={() => setTab("Findings")}
            />
          )}
          {tab === "Targets" && <Targets onScan={() => setShowScan(true)} />}
          {tab === "Scans" && <Scans onScan={() => setShowScan(true)} />}
          {tab === "Assets" && <Assets />}
          {tab === "Findings" && (
            <FindingsView
              findings={filteredFindings}
              query={query}
              onQuery={setQuery}
              onSelect={setSelectedFinding}
            />
          )}
          {tab === "Reports" && <Reports />}
        </div>
      </main>

      {showScan && <ScanModal onClose={() => setShowScan(false)} />}
      {selectedFinding && (
        <FindingDrawer
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({
  onScan,
  onFindings,
}: {
  onScan: () => void;
  onFindings: () => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="SECURITY POSTURE / OCTOBER 07, 2026"
        title="Good morning, Jordan."
        description="Your workspace is protected. Here’s what needs attention today."
        action={
          <button className="primary-button" onClick={onScan}>
            <Play size={16} fill="currentColor" /> Start a scan
          </button>
        }
      />
      <div className="metric-grid">
        <Metric
          label="Posture score"
          value="78"
          suffix="/100"
          change="+6.4%"
          icon={<ShieldCheck />}
          tone="purple"
          detail="vs. last 30 days"
        />
        <Metric
          label="Open findings"
          value="14"
          change="-3"
          icon={<AlertTriangle />}
          tone="amber"
          detail="since last scan"
        />
        <Metric
          label="Monitored assets"
          value="18"
          change="+2"
          icon={<Network />}
          tone="blue"
          detail="across 3 targets"
        />
        <Metric
          label="Last scan"
          value="12m"
          suffix="ago"
          change="Completed"
          icon={<Activity />}
          tone="green"
          detail="18m 24s duration"
        />
      </div>
      <div className="dashboard-grid">
        <section className="card posture-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">POSTURE TREND</span>
              <h2>Risk is trending down</h2>
            </div>
            <button className="ghost-button">
              Last 30 days <ChevronRight size={14} />
            </button>
          </div>
          <div className="chart-area">
            <div className="y-axis">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
            </div>
            <div className="chart">
              <div className="chart-grid">
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 700 190"
                preserveAspectRatio="none"
                aria-label="Posture score trend"
              >
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#786bff" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#786bff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 142 C62 136 78 121 140 128 S225 105 280 112 S349 90 420 95 S490 66 560 74 S630 60 700 52 V190 H0Z"
                  fill="url(#fill)"
                />
                <path
                  d="M0 142 C62 136 78 121 140 128 S225 105 280 112 S349 90 420 95 S490 66 560 74 S630 60 700 52"
                  fill="none"
                  stroke="#8a7fff"
                  strokeWidth="3"
                />
              </svg>
              <div className="x-axis">
                {postureHistory.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="chart-foot">
            <span>
              <i className="legend-dot purple" />
              Posture score
            </span>
            <b>
              <TrendingUp size={14} /> 12 pts improvement
            </b>
          </div>
        </section>
        <section className="card attention-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">NEEDS ATTENTION</span>
              <h2>Prioritize these findings</h2>
            </div>
            <button className="icon-button">
              <MoreHorizontal size={17} />
            </button>
          </div>
          <div className="finding-list">
            {findings.slice(0, 3).map((finding) => (
              <FindingRow finding={finding} key={finding.id} />
            ))}
          </div>
          <button className="view-all" onClick={onFindings}>
            View all findings <ArrowUpRight size={14} />
          </button>
        </section>
      </div>
      <div className="dashboard-grid lower-grid">
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">RECENT SCANS</span>
              <h2>Scan activity</h2>
            </div>
            <button className="ghost-button">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <ScanTable compact />
        </section>
        <section className="card quick-start">
          <div className="card-heading">
            <div>
              <span className="eyebrow">QUICK START</span>
              <h2>Secure your next release</h2>
            </div>
            <Zap size={20} className="gold-icon" />
          </div>
          <p>
            Connect your delivery pipeline to run an authorized baseline scan on
            every release.
          </p>
          <div className="quick-actions">
            <button>
              <GitBranch size={15} /> Connect GitHub
            </button>
            <button>
              <TerminalSquare size={15} /> API access
            </button>
          </div>
          <div className="setup-progress">
            <span>Workspace setup</span>
            <b>3 of 5 complete</b>
            <div>
              <i />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  suffix,
  change,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  change: string;
  detail: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <div className="metric-label">
        {label}
        <span className={change.startsWith("-") ? "change positive" : "change"}>
          {change}
        </span>
      </div>
      <div className="metric-value">
        {value}
        <small>{suffix}</small>
      </div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function FindingRow({
  finding,
  onSelect,
}: {
  finding: Finding;
  onSelect?: (finding: Finding) => void;
}) {
  return (
    <button className="finding-row" onClick={() => onSelect?.(finding)}>
      <span className={`severity-dot ${finding.severity.toLowerCase()}`} />
      <span className="finding-row-main">
        <b>{finding.title}</b>
        <small>{finding.asset}</small>
      </span>
      <span className={`severity-label ${finding.severity.toLowerCase()}`}>
        {finding.severity}
      </span>
      <ChevronRight size={15} />
    </button>
  );
}

function Targets({ onScan }: { onScan: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow="ATTACK SURFACE / 3 TARGETS"
        title="Targets & scope"
        description="Define exactly what SentinelScan is authorized to assess."
        action={
          <button className="primary-button">
            <Plus size={16} /> Add target
          </button>
        }
      />
      <div className="notice">
        <LockKeyhole size={18} />
        <span>
          <b>Authorization gate is active.</b> Every scan requires an explicit
          scope confirmation before it can run.
        </span>
        <button>
          Review policy <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="target-grid">
        {targets.map((target) => (
          <div className="card target-card" key={target.id}>
            <div className="target-top">
              <span className="target-logo">
                <Globe2 size={19} />
              </span>
              <span className={`status-pill ${target.status.toLowerCase()}`}>
                <i />
                {target.status}
              </span>
              <button className="icon-button">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <h3>{target.name}</h3>
            <a href={target.url}>{target.url}</a>
            <div className="target-meta">
              <span>
                <Users size={14} />
                {target.owner}
              </span>
              <span>
                <Cloud size={14} />
                {target.environment}
              </span>
            </div>
            <div className="scope-box">
              <span>AUTHORIZED SCOPE</span>
              <b>{target.scope}</b>
            </div>
            <div className="target-footer">
              <span>
                Last scan <b>{target.lastScan}</b>
              </span>
              <button className="small-button" onClick={onScan}>
                <Play size={13} /> Scan
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Scans({ onScan }: { onScan: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow="OPERATIONS / SCAN HISTORY"
        title="Scans"
        description="Monitor authorized assessments and review their outcomes."
        action={
          <button className="primary-button" onClick={onScan}>
            <Play size={16} fill="currentColor" /> New scan
          </button>
        }
      />
      <div className="scan-summary">
        <div>
          <span>Completed this month</span>
          <b>24</b>
          <small>+18% vs. September</small>
        </div>
        <div>
          <span>Average duration</span>
          <b>11m 42s</b>
          <small>Across all profiles</small>
        </div>
        <div>
          <span>Findings discovered</span>
          <b>61</b>
          <small>14 remain open</small>
        </div>
        <div>
          <span>Authorization coverage</span>
          <b>100%</b>
          <small>All scans scoped</small>
        </div>
      </div>
      <section className="card">
        <div className="table-toolbar">
          <div>
            <h2>All scan runs</h2>
            <span>Showing 3 of 24 runs</span>
          </div>
          <div className="toolbar-actions">
            <button className="ghost-button">
              <Filter size={14} /> Filter
            </button>
            <button className="ghost-button">
              <SlidersHorizontal size={14} /> Columns
            </button>
          </div>
        </div>
        <ScanTable />
      </section>
    </>
  );
}

function ScanTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Target</th>
            <th>Profile</th>
            <th>Status</th>
            <th>Findings</th>
            <th>Score</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {scans.slice(0, compact ? 3 : 10).map((scan) => (
            <tr key={scan.id}>
              <td>
                <b className="mono">{scan.id}</b>
                <small>{scan.started}</small>
              </td>
              <td>{scan.target}</td>
              <td>{scan.profile}</td>
              <td>
                <span className={`status-pill ${scan.status.toLowerCase()}`}>
                  <i />
                  {scan.status}
                </span>
              </td>
              <td>
                <b>{scan.findings}</b>
              </td>
              <td>
                <span className={`score ${scan.score > 89 ? "good" : "watch"}`}>
                  {scan.score}
                </span>
              </td>
              <td>
                <button className="icon-button">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Assets() {
  return (
    <>
      <PageHeader
        eyebrow="ATTACK SURFACE / 290 ENDPOINTS"
        title="Assets & endpoints"
        description="Inventory discovered services, routes, and exposure across your targets."
        action={
          <button className="ghost-button">
            <Filter size={14} /> Filter assets
          </button>
        }
      />
      <div className="asset-stats">
        <Metric
          label="Total assets"
          value="18"
          change="+2"
          detail="this month"
          icon={<Network />}
          tone="blue"
        />
        <Metric
          label="Endpoints"
          value="290"
          change="+34"
          detail="discovered this week"
          icon={<Globe2 />}
          tone="purple"
        />
        <Metric
          label="Internet-facing"
          value="14"
          change="78%"
          detail="of total assets"
          icon={<Cloud />}
          tone="amber"
        />
      </div>
      <section className="card">
        <div className="table-toolbar">
          <div>
            <h2>Discovered assets</h2>
            <span>Last inventory update 12 minutes ago</span>
          </div>
          <div className="search-box">
            <Search size={15} />
            <input placeholder="Search assets" />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Endpoints</th>
                <th>Exposure</th>
                <th>Last seen</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.name}>
                  <td>
                    <span className="asset-name">
                      <span className="asset-icon">
                        <Globe2 size={14} />
                      </span>
                      <b>{asset.name}</b>
                    </span>
                  </td>
                  <td>{asset.type}</td>
                  <td>
                    <b>{asset.endpoints}</b>
                  </td>
                  <td>
                    <span
                      className={`exposure ${asset.exposure === "Restricted" ? "restricted" : ""}`}
                    >
                      <i />
                      {asset.exposure}
                    </span>
                  </td>
                  <td>{asset.lastSeen}</td>
                  <td>
                    <button className="icon-button">
                      <ArrowUpRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function FindingsView({
  findings: visibleFindings,
  query,
  onQuery,
  onSelect,
}: {
  findings: Finding[];
  query: string;
  onQuery: (value: string) => void;
  onSelect: (finding: Finding) => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="RISK REGISTER / 14 OPEN"
        title="Findings"
        description="Evidence-backed issues prioritized by severity and confidence."
        action={
          <button className="ghost-button">
            <FileText size={15} /> Export report
          </button>
        }
      />
      <div className="finding-summary">
        <div className="critical">
          <span>Critical</span>
          <b>0</b>
        </div>
        <div className="high">
          <span>High</span>
          <b>1</b>
        </div>
        <div className="medium">
          <span>Medium</span>
          <b>8</b>
        </div>
        <div className="low">
          <span>Low</span>
          <b>5</b>
        </div>
      </div>
      <section className="card">
        <div className="table-toolbar">
          <div>
            <h2>Open findings</h2>
            <span>Sorted by severity and confidence</span>
          </div>
          <div className="toolbar-actions">
            <div className="search-box">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                placeholder="Search findings"
              />
            </div>
            <button className="ghost-button">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>
        <div className="findings-table">
          {visibleFindings.map((finding) => (
            <button
              className="finding-card-row"
              onClick={() => onSelect(finding)}
              key={finding.id}
            >
              <span
                className={`severity-bar ${finding.severity.toLowerCase()}`}
              />
              <span className="finding-card-content">
                <span>
                  <b>{finding.title}</b>
                  <small>
                    {finding.id} · {finding.asset}
                  </small>
                </span>
                <span className="finding-tags">
                  <span
                    className={`severity-label ${finding.severity.toLowerCase()}`}
                  >
                    {finding.severity}
                  </span>
                  <span className="confidence">
                    <Activity size={13} />
                    {finding.confidence}% confidence
                  </span>
                </span>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function Reports() {
  return (
    <>
      <PageHeader
        eyebrow="EVIDENCE & GOVERNANCE"
        title="Reports"
        description="Create an audit-ready record of your authorized security program."
        action={
          <button className="primary-button">
            <Plus size={16} /> Create report
          </button>
        }
      />
      <div className="report-grid">
        <div className="card report-hero">
          <div className="report-icon">
            <FileText size={22} />
          </div>
          <span className="eyebrow">MONTHLY EXECUTIVE REPORT</span>
          <h2>October security posture</h2>
          <p>
            Share a concise summary of risk, remediation progress, and coverage
            with your stakeholders.
          </p>
          <div className="report-meta">
            <span>Generated Oct 07, 2026</span>
            <span>14 open findings</span>
          </div>
          <button className="primary-button">
            <FileText size={15} /> Preview report
          </button>
        </div>
        <div className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">DELIVERY</span>
              <h2>Integrations</h2>
            </div>
          </div>
          <div className="integration-row">
            <span className="integration-icon github">GH</span>
            <span>
              <b>GitHub Actions</b>
              <small>Run scans in CI/CD</small>
            </span>
            <span className="connected">Connected</span>
          </div>
          <div className="integration-row">
            <span className="integration-icon slack">S</span>
            <span>
              <b>Slack</b>
              <small>Finding notifications</small>
            </span>
            <button className="link-button">Connect</button>
          </div>
          <div className="integration-row">
            <span className="integration-icon api">{"{}"}</span>
            <span>
              <b>REST API</b>
              <small>Programmatic access</small>
            </span>
            <button className="link-button">View docs</button>
          </div>
        </div>
      </div>
      <div className="card api-card">
        <div>
          <span className="eyebrow">AUTOMATION SURFACE</span>
          <h2>Build security into delivery</h2>
          <p>
            Use the SentinelScan API and CI checks to block releases when a new
            high-severity issue enters scope.
          </p>
        </div>
        <div className="code-snippet">
          <span>
            <b>POST</b> /v1/scans
          </span>
          <code>{`{ "target_id": "t-001", "profile": "api-baseline", "scope_confirmed": true }`}</code>
        </div>
      </div>
    </>
  );
}

function ScanModal({ onClose }: { onClose: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [profile, setProfile] = useState(scanProfiles[1]?.name ?? "");
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">NEW ASSESSMENT</span>
            <h2>Start an authorized scan</h2>
            <p>
              Choose a target and profile. No scan starts until scope is
              confirmed.
            </p>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <label className="field-label">Target</label>
        <select>
          <option>Acme customer portal · Production</option>
          <option>Acme commerce API · Staging</option>
          <option>Acme mobile gateway · Production</option>
        </select>
        <label className="field-label">Scan profile</label>
        <div className="profile-options">
          {scanProfiles.map((item) => (
            <button
              className={
                profile === item.name
                  ? "profile-option selected"
                  : "profile-option"
              }
              onClick={() => setProfile(item.name)}
              key={item.name}
            >
              <span className={`profile-icon ${item.tone}`}>
                <Radar size={16} />
              </span>
              <span>
                <b>{item.name}</b>
                <small>{item.detail}</small>
              </span>
              <em>{item.duration}</em>
              {profile === item.name && <Check size={16} />}
            </button>
          ))}
        </div>
        <label className="authorization-check">
          <input
            type="checkbox"
            checked={authorized}
            onChange={(event) => setAuthorized(event.target.checked)}
          />
          <span>
            <b>I confirm this target is authorized for testing.</b>
            <small>
              I have permission to assess the selected scope and understand that
              active checks will be limited to the authorized target.
            </small>
          </span>
        </label>
        <div className="modal-footer">
          <button className="ghost-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" disabled={!authorized}>
            <Play size={15} fill="currentColor" /> Run {profile}
          </button>
        </div>
      </div>
    </div>
  );
}

function FindingDrawer({
  finding,
  onClose,
}: {
  finding: Finding;
  onClose: () => void;
}) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="finding-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <span className={`severity-label ${finding.severity.toLowerCase()}`}>
            {finding.severity} severity
          </span>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <h2>{finding.title}</h2>
        <p className="drawer-subtitle">{finding.asset}</p>
        <div className="drawer-tags">
          <span>
            <Activity size={13} /> {finding.confidence}% confidence
          </span>
          <span>
            <AlertTriangle size={13} /> {finding.category}
          </span>
          <span>
            <ShieldCheck size={13} /> OWASP {finding.owasp}
          </span>
        </div>
        <div className="drawer-section">
          <span className="eyebrow">EVIDENCE</span>
          <h3>Observed behavior</h3>
          <pre>{finding.evidence}</pre>
        </div>
        <div className="drawer-section">
          <span className="eyebrow">REMEDIATION</span>
          <h3>Recommended action</h3>
          <p>{finding.remediation}</p>
        </div>
        <div className="drawer-section">
          <span className="eyebrow">CONTEXT</span>
          <div className="context-row">
            <span>Finding ID</span>
            <b className="mono">{finding.id}</b>
          </div>
          <div className="context-row">
            <span>Discovered</span>
            <b>{finding.discovered}</b>
          </div>
        </div>
        <button className="primary-button drawer-action">
          <Check size={15} /> Mark as triaged
        </button>
      </aside>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
