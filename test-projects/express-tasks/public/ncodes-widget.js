var NCodes=(()=>{var u=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var re=u((es,oe)=>{var ae={user:null,apiUrl:"/api/generate",provider:"openai",model:"gpt-5-mini",mode:"simulation",theme:"dark",position:"bottom-center",triggerLabel:"Build with AI",panelTitle:"n.codes",panelIntro:"Describe the UI you need and it will be generated instantly.",quickPrompts:[]},ee=new Set(["simulation","live"]),te=new Set(["dark","light","auto"]),ne=new Set(["bottom-center","bottom-right","bottom-left"]);function se(e){if(!e||typeof e!="object")throw new Error("NCodes.init() requires a config object.");if(e.mode&&!ee.has(e.mode))throw new Error(`Invalid mode "${e.mode}". Use: ${Array.from(ee).join(", ")}`);if(e.theme&&!te.has(e.theme))throw new Error(`Invalid theme "${e.theme}". Use: ${Array.from(te).join(", ")}`);if(e.position&&!ne.has(e.position))throw new Error(`Invalid position "${e.position}". Use: ${Array.from(ne).join(", ")}`);return!0}function Dt(e){return se(e),{...ae,...e}}oe.exports={DEFAULTS:ae,validateConfig:se,mergeConfig:Dt}});var de=u((ts,ie)=>{function jt(e){return`
    :host {
      ${e!=="light"?`
    --ncodes-bg-body: #050505;
    --ncodes-bg-card: #0f0f0f;
    --ncodes-bg-panel: #0d0d0d;
    --ncodes-border-color: #262626;
    --ncodes-border-light: #1a1a1a;
    --ncodes-text-main: #ededed;
    --ncodes-text-muted: #a1a1aa;
    --ncodes-text-dim: #52525b;
    --ncodes-accent: #4ade80;
    --ncodes-accent-dim: rgba(74, 222, 128, 0.1);
    --ncodes-accent-hover: #86efac;
    --ncodes-danger: #f87171;
    --ncodes-danger-dim: rgba(248, 113, 113, 0.1);
    --ncodes-warning: #fbbf24;
    --ncodes-warning-dim: rgba(251, 191, 36, 0.1);
  `:`
    --ncodes-bg-body: #ffffff;
    --ncodes-bg-card: #f9fafb;
    --ncodes-bg-panel: #ffffff;
    --ncodes-border-color: #e5e7eb;
    --ncodes-border-light: #f3f4f6;
    --ncodes-text-main: #111827;
    --ncodes-text-muted: #6b7280;
    --ncodes-text-dim: #9ca3af;
    --ncodes-accent: #22c55e;
    --ncodes-accent-dim: rgba(34, 197, 94, 0.1);
    --ncodes-accent-hover: #16a34a;
    --ncodes-danger: #ef4444;
    --ncodes-danger-dim: rgba(239, 68, 68, 0.1);
    --ncodes-warning: #f59e0b;
    --ncodes-warning-dim: rgba(245, 158, 11, 0.1);
  `}
      --ncodes-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --ncodes-mono: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
      all: initial;
      font-family: var(--ncodes-font);
      color: var(--ncodes-text-main);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ===== Trigger Button ===== */
    .ncodes-trigger {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      height: 36px;
      padding: 0 16px;
      border-radius: 99px;
      background: var(--ncodes-bg-card);
      border: 1px solid var(--ncodes-border-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--ncodes-text-muted);
      font-size: 13px;
      font-weight: 500;
      font-family: var(--ncodes-font);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
      z-index: 10000;
      animation: ncodes-breathe 3s infinite ease-in-out;
    }

    .ncodes-trigger.bottom-right {
      left: auto;
      right: 16px;
      transform: none;
    }

    .ncodes-trigger.bottom-left {
      left: 16px;
      transform: none;
    }

    @keyframes ncodes-breathe {
      0% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border-color: var(--ncodes-border-color);
      }
      50% {
        box-shadow: 0 0 25px var(--ncodes-accent-dim), 0 0 10px var(--ncodes-accent-dim);
        border-color: var(--ncodes-accent);
      }
      100% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border-color: var(--ncodes-border-color);
      }
    }

    .ncodes-trigger svg {
      width: 16px;
      height: 16px;
      color: var(--ncodes-accent);
    }

    .ncodes-trigger:hover {
      background: var(--ncodes-bg-panel);
      border-color: var(--ncodes-accent);
      color: var(--ncodes-text-main);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
    }

    .ncodes-trigger:active {
      transform: translateX(-50%) scale(0.98);
    }

    .ncodes-trigger.bottom-right:active,
    .ncodes-trigger.bottom-left:active {
      transform: scale(0.98);
    }

    .ncodes-trigger.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%) scale(0.9);
    }

    .ncodes-trigger.bottom-right.hidden {
      transform: scale(0.9);
    }

    .ncodes-trigger.bottom-left.hidden {
      transform: scale(0.9);
    }

    /* ===== Panel ===== */
    @keyframes ncodes-glow-rotate {
      from { --ncodes-glow-angle: 0deg; }
      to { --ncodes-glow-angle: 360deg; }
    }

    @keyframes ncodes-glow-breathe {
      0%, 100% {
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 20px rgba(74, 222, 128, 0.1),
          0 0 40px rgba(74, 222, 128, 0.05);
      }
      50% {
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 40px rgba(74, 222, 128, 0.25),
          0 0 80px rgba(74, 222, 128, 0.12),
          0 0 120px rgba(74, 222, 128, 0.06);
      }
    }

    .ncodes-panel {
      position: fixed;
      bottom: 64px;
      left: 50%;
      transform: translateX(-50%) scale(0.95);
      width: 400px;
      max-height: calc(100vh - 100px);
      background: var(--ncodes-bg-panel);
      border: 1px solid transparent;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transform-origin: bottom center;
      transition: all 0.2s ease;
    }

    .ncodes-panel.open {
      transform: translateX(-50%) scale(1);
      opacity: 1;
      pointer-events: auto;
      --ncodes-glow-angle: 0deg;
      animation:
        ncodes-glow-rotate 4s linear infinite,
        ncodes-glow-breathe 3s ease-in-out infinite;
      background:
        linear-gradient(var(--ncodes-bg-panel), var(--ncodes-bg-panel)) padding-box,
        conic-gradient(
          from var(--ncodes-glow-angle, 0deg),
          var(--ncodes-accent),
          rgba(74, 222, 128, 0.15),
          rgba(56, 189, 248, 0.6),
          rgba(139, 92, 246, 0.5),
          var(--ncodes-accent),
          rgba(74, 222, 128, 0.15),
          var(--ncodes-accent)
        ) border-box;
      border: 1.5px solid transparent;
    }

    .ncodes-panel.bottom-right {
      left: auto;
      right: 16px;
      transform: scale(0.95);
      transform-origin: bottom right;
    }

    .ncodes-panel.bottom-left {
      left: 16px;
      transform: scale(0.95);
      transform-origin: bottom left;
    }

    .ncodes-panel.bottom-right.open {
      transform: scale(1);
    }

    .ncodes-panel.bottom-left.open {
      transform: scale(1);
    }

    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--ncodes-border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
    }

    .panel-logo {
      width: 28px;
      height: 28px;
      background: var(--ncodes-accent);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #000;
      font-size: 16px;
      font-family: var(--ncodes-mono);
    }

    .panel-close {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--ncodes-text-dim);
      font-size: 20px;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
    }

    .panel-close:hover {
      background: var(--ncodes-bg-card);
      color: var(--ncodes-text-main);
    }

    .panel-body {
      padding: 20px;
      overflow-y: auto;
    }

    .panel-intro {
      margin-bottom: 20px;
    }

    .panel-intro p {
      color: var(--ncodes-text-muted);
      font-size: 14px;
      line-height: 1.5;
    }

    /* ===== Prompt Section ===== */
    .prompt-section {
      margin-bottom: 24px;
    }

    .prompt-input {
      width: 100%;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 10px;
      padding: 14px 16px;
      color: var(--ncodes-text-main);
      font-size: 14px;
      font-family: var(--ncodes-font);
      resize: none;
      margin-bottom: 12px;
      transition: border-color 0.15s ease;
    }

    .prompt-input:focus {
      outline: none;
      border-color: var(--ncodes-accent);
    }

    .prompt-input::placeholder {
      color: var(--ncodes-text-dim);
    }

    .generate-btn {
      width: 100%;
      padding: 12px 20px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 10px;
      color: #000;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: var(--ncodes-font);
    }

    .generate-btn:hover {
      background: var(--ncodes-accent-hover);
    }

    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-loading {
      display: flex;
      gap: 4px;
    }

    .loading-dot {
      width: 6px;
      height: 6px;
      background: #000;
      border-radius: 50%;
      animation: ncodes-bounce 1.4s infinite ease-in-out both;
    }

    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes ncodes-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* ===== Quick Prompts ===== */
    .quick-prompts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quick-prompts-label {
      font-size: 12px;
      color: var(--ncodes-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .quick-prompt {
      padding: 10px 14px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      color: var(--ncodes-text-muted);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
    }

    .quick-prompt:hover {
      border-color: var(--ncodes-accent);
      color: var(--ncodes-text-main);
      background: var(--ncodes-accent-dim);
    }

    /* ===== Generation Status ===== */
    .generation-status {
      margin-top: 20px;
      padding: 16px;
      background: var(--ncodes-bg-body);
      border-radius: 10px;
      border: 1px solid var(--ncodes-border-color);
    }

    .status-line {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--ncodes-text-muted);
      font-size: 13px;
    }

    .status-icon {
      font-size: 16px;
    }

    .status-icon.spinning {
      animation: ncodes-spin 1s linear infinite;
    }

    @keyframes ncodes-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ===== Panel Expansion (result view) \u2014 centered dialog ===== */
    .ncodes-panel.expanded {
      width: 80vw;
      height: 80vh;
      max-width: 1200px;
      max-height: 80vh;
      top: 50%;
      left: 50% !important;
      right: auto !important;
      bottom: auto;
      transform: translate(-50%, -50%) !important;
      transform-origin: center center;
      border-radius: 16px;
    }

    /* ===== View Toggling ===== */
    .result-view {
      display: none;
    }

    .ncodes-panel.expanded .prompt-view {
      display: none;
    }

    .ncodes-panel.expanded .result-view {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .ncodes-panel.expanded .panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* ===== History Section ===== */
    .history-section {
      margin-bottom: 20px;
    }

    .history-label {
      font-size: 12px;
      color: var(--ncodes-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
    }

    .history-item:hover {
      border-color: var(--ncodes-accent);
      background: var(--ncodes-accent-dim);
    }

    .history-prompt-text {
      flex: 1;
      font-size: 13px;
      color: var(--ncodes-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-item:hover .history-prompt-text {
      color: var(--ncodes-text-main);
    }

    .history-badge {
      font-size: 10px;
      padding: 2px 8px;
      background: var(--ncodes-bg-card);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 4px;
      color: var(--ncodes-text-dim);
      font-family: var(--ncodes-mono);
      flex-shrink: 0;
    }

    .history-delete {
      width: 22px;
      height: 22px;
      border: none;
      background: transparent;
      color: var(--ncodes-text-dim);
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
      font-family: var(--ncodes-font);
    }

    .history-delete:hover {
      background: var(--ncodes-danger-dim);
      color: var(--ncodes-danger);
    }

    /* ===== Result View ===== */
    .result-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--ncodes-border-color);
    }

    .result-back-btn {
      padding: 6px 12px;
      border: 1px solid var(--ncodes-border-color);
      background: var(--ncodes-bg-body);
      color: var(--ncodes-text-muted);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
      flex-shrink: 0;
    }

    .result-back-btn:hover {
      background: var(--ncodes-bg-card);
      color: var(--ncodes-text-main);
    }

    .result-prompt-label {
      font-size: 13px;
      color: var(--ncodes-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-content {
      overflow-y: auto;
      flex: 1;
      background: var(--ncodes-bg-card);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 12px;
    }

    /* ===== Generated UI (inline) ===== */

    .generated-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--ncodes-border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .generated-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .generated-title h2 {
      font-size: 18px;
      font-weight: 600;
      color: var(--ncodes-text-main);
    }

    .generated-badge {
      font-size: 11px;
      padding: 4px 10px;
      background: var(--ncodes-accent-dim);
      color: var(--ncodes-accent);
      border-radius: 99px;
      font-family: var(--ncodes-mono);
      font-weight: 500;
    }

    .close-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid var(--ncodes-border-color);
      background: var(--ncodes-bg-body);
      color: var(--ncodes-text-muted);
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
    }

    .close-btn:hover {
      background: var(--ncodes-bg-card);
      color: var(--ncodes-text-main);
    }

    .generated-body {
      padding: 24px;
    }

    /* ===== Data Table (for generated UIs) ===== */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .data-table th {
      text-align: left;
      color: var(--ncodes-text-dim);
      font-weight: 500;
      padding: 12px 16px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--ncodes-border-color);
    }

    .data-table td {
      padding: 16px;
      color: var(--ncodes-text-muted);
      border-bottom: 1px solid var(--ncodes-border-light);
      vertical-align: middle;
    }

    .data-table tbody tr:last-child td {
      border-bottom: none;
    }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--ncodes-text-muted);
      flex-shrink: 0;
    }

    .customer-name {
      font-weight: 500;
      color: var(--ncodes-text-main);
      margin-bottom: 2px;
    }

    .customer-email {
      font-size: 12px;
      color: var(--ncodes-text-dim);
    }

    .mono {
      font-family: var(--ncodes-mono);
      font-size: 13px;
    }

    .amount {
      font-family: var(--ncodes-mono);
      color: var(--ncodes-text-main);
      font-weight: 500;
    }

    .overdue-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .overdue-badge.mild {
      background: var(--ncodes-warning-dim);
      color: var(--ncodes-warning);
    }

    .overdue-badge.moderate {
      background: rgba(251, 146, 60, 0.1);
      color: #fb923c;
    }

    .overdue-badge.severe {
      background: var(--ncodes-danger-dim);
      color: var(--ncodes-danger);
    }

    .action-btn {
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      font-family: var(--ncodes-font);
    }

    .action-btn.remind {
      background: var(--ncodes-accent-dim);
      color: var(--ncodes-accent);
    }

    .action-btn.remind:hover {
      background: var(--ncodes-accent);
      color: #000;
    }

    .action-btn.primary {
      background: var(--ncodes-accent);
      color: #000;
    }

    .action-btn.primary:hover {
      background: var(--ncodes-accent-hover);
    }

    .action-btn.secondary {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      color: var(--ncodes-text-muted);
    }

    .action-btn.secondary:hover {
      color: var(--ncodes-text-main);
    }

    .action-btn.danger {
      background: var(--ncodes-danger);
      color: #fff;
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      margin-top: 8px;
      border-top: 1px solid var(--ncodes-border-color);
    }

    .table-info {
      font-size: 13px;
      color: var(--ncodes-text-dim);
    }

    /* ===== Health Dashboard Styles ===== */
    .health-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .health-stat {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 12px;
      padding: 20px;
    }

    .health-stat-value {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .health-stat.healthy .health-stat-value { color: var(--ncodes-accent); }
    .health-stat.at-risk .health-stat-value { color: var(--ncodes-warning); }
    .health-stat.churning .health-stat-value { color: var(--ncodes-danger); }

    .health-stat-label {
      font-size: 13px;
      color: var(--ncodes-text-muted);
      margin-bottom: 12px;
    }

    .health-bar {
      height: 4px;
      background: var(--ncodes-border-color);
      border-radius: 2px;
      overflow: hidden;
    }

    .health-bar-fill {
      height: 100%;
      border-radius: 2px;
    }

    .health-stat.healthy .health-bar-fill { background: var(--ncodes-accent); }
    .health-stat.at-risk .health-bar-fill { background: var(--ncodes-warning); }
    .health-stat.churning .health-bar-fill { background: var(--ncodes-danger); }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .dashboard-card {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 12px;
      padding: 20px;
    }

    .dashboard-card h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 16px;
    }

    .risk-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .risk-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .risk-customer {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--ncodes-text-muted);
    }

    .risk-score {
      font-family: var(--ncodes-mono);
      font-size: 13px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .risk-score.high {
      background: var(--ncodes-danger-dim);
      color: var(--ncodes-danger);
    }

    .risk-score.medium {
      background: var(--ncodes-warning-dim);
      color: var(--ncodes-warning);
    }

    .avatar.small {
      width: 28px;
      height: 28px;
      font-size: 10px;
    }

    .mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 80px;
      margin-bottom: 8px;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(to top, var(--ncodes-accent), rgba(74, 222, 128, 0.3));
      border-radius: 4px 4px 0 0;
      min-height: 10px;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--ncodes-text-dim);
    }

    .dashboard-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* ===== Archive Styles ===== */
    .archive-info {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 20px;
    }

    .archive-stat-value {
      font-size: 48px;
      font-weight: 600;
      color: var(--ncodes-warning);
      display: block;
    }

    .archive-stat-label {
      font-size: 14px;
      color: var(--ncodes-text-muted);
    }

    .selection-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px 8px 0 0;
      border-bottom: none;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--ncodes-text-muted);
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--ncodes-accent);
    }

    .selection-count {
      font-size: 12px;
      color: var(--ncodes-text-dim);
    }

    .data-table.selectable {
      border: 1px solid var(--ncodes-border-color);
      border-radius: 0 0 8px 8px;
    }

    .row-checkbox {
      width: 16px;
      height: 16px;
      accent-color: var(--ncodes-accent);
    }

    .muted {
      color: var(--ncodes-text-dim);
    }

    .type-badge {
      display: inline-block;
      padding: 4px 10px;
      background: var(--ncodes-bg-card);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      color: var(--ncodes-text-muted);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge.inactive {
      background: var(--ncodes-border-color);
      color: var(--ncodes-text-dim);
    }

    .archive-actions {
      display: flex;
      gap: 12px;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .ncodes-panel {
        width: calc(100% - 32px);
        left: 16px !important;
        right: 16px;
        transform: scale(0.95) !important;
      }

      .ncodes-panel.open {
        transform: scale(1) !important;
      }

      .ncodes-panel.expanded {
        width: 95vw;
        height: 90vh;
        max-height: 90vh;
      }

      .health-stats {
        grid-template-columns: 1fr;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ===== Error State ===== */
    .ncodes-error-state {
      text-align: center;
      padding: 32px 20px;
    }

    .ncodes-error-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .ncodes-error-message {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      line-height: 1.5;
      margin-bottom: 20px;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }

    .ncodes-error-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .ncodes-error-retry {
      padding: 8px 18px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: background 0.15s ease;
    }

    .ncodes-error-retry:hover {
      background: var(--ncodes-accent-hover);
    }

    .ncodes-error-fallback {
      padding: 8px 18px;
      background: transparent;
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      color: var(--ncodes-text-muted);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: border-color 0.15s ease;
    }

    .ncodes-error-fallback:hover {
      border-color: var(--ncodes-text-muted);
    }
  `}ie.exports={getStyles:jt}});var le=u((ns,ce)=>{function Pt(){let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("width","18"),e.setAttribute("height","18"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.setAttribute("stroke","currentColor"),e.setAttribute("stroke-width","2.5");let t=document.createElementNS("http://www.w3.org/2000/svg","path");t.setAttribute("d","M7 4h-3v16h3"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round");let n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d","M17 4h3v16h-3"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),e.appendChild(t),e.appendChild(n),e}function Rt(e,t){let n=document.createElement("button");n.className=`ncodes-trigger ${e.position}`,n.title="Open n.codes",n.appendChild(Pt());let s=document.createElement("span");return s.textContent=e.triggerLabel,n.appendChild(s),n.addEventListener("click",t),n}function Mt(e){e.classList.remove("hidden")}function Ot(e){e.classList.add("hidden")}ce.exports={createTrigger:Rt,showTrigger:Mt,hideTrigger:Ot}});var he=u((as,fe)=>{function _t(e){let t=document.createElement("div");t.className=`ncodes-panel ${e.position}`;let n=document.createElement("div");n.className="panel-header";let s=document.createElement("div");s.className="panel-title";let a=document.createElement("span");a.className="panel-logo",a.textContent="n";let o=document.createElement("span");o.textContent=e.panelTitle,s.appendChild(a),s.appendChild(o);let r=document.createElement("button");r.className="panel-close",r.setAttribute("data-ncodes-panel-close",""),r.textContent="\xD7",n.appendChild(s),n.appendChild(r);let i=document.createElement("div");i.className="panel-body";let c=document.createElement("div");c.className="prompt-view";let l=document.createElement("div");l.className="panel-intro";let p=document.createElement("p");p.textContent=e.panelIntro,l.appendChild(p);let m=document.createElement("div");m.className="history-section",m.style.display="none";let f=document.createElement("div");f.className="history-label",f.textContent="Recent features";let J=document.createElement("div");J.className="history-list",m.appendChild(f),m.appendChild(J);let A=document.createElement("div");A.className="prompt-section";let N=document.createElement("textarea");N.className="prompt-input",N.placeholder="e.g., Show me overdue invoices with a remind button...",N.rows=3;let $=document.createElement("button");$.className="generate-btn";let O=document.createElement("span");O.className="btn-text",O.textContent="Generate";let T=document.createElement("span");T.className="btn-loading",T.style.display="none";for(let b=0;b<3;b++){let y=document.createElement("span");y.className="loading-dot",T.appendChild(y)}if($.appendChild(O),$.appendChild(T),A.appendChild(N),A.appendChild($),c.appendChild(l),c.appendChild(m),c.appendChild(A),e.quickPrompts.length>0){let b=document.createElement("div");b.className="quick-prompts";let y=document.createElement("div");y.className="quick-prompts-label",y.textContent="Try these examples:",b.appendChild(y),e.quickPrompts.forEach(Z=>{let j=document.createElement("button");j.className="quick-prompt",j.setAttribute("data-prompt",Z.prompt),j.textContent=Z.label,b.appendChild(j)}),c.appendChild(b)}let L=document.createElement("div");L.className="generation-status",L.style.display="none";let q=document.createElement("div");q.className="status-line";let _=document.createElement("span");_.className="status-icon spinning",_.textContent="\u2699";let F=document.createElement("span");F.className="status-text",F.textContent="Analyzing request...",q.appendChild(_),q.appendChild(F),L.appendChild(q),c.appendChild(L);let z=document.createElement("div");z.className="result-view";let I=document.createElement("div");I.className="result-header";let D=document.createElement("button");D.className="result-back-btn",D.setAttribute("data-ncodes-back",""),D.textContent="\u2190 Back";let W=document.createElement("span");W.className="result-prompt-label",I.appendChild(D),I.appendChild(W);let K=document.createElement("div");return K.className="result-content",z.appendChild(I),z.appendChild(K),i.appendChild(c),i.appendChild(z),t.appendChild(n),t.appendChild(i),t}function Ft(e,t){e.classList.add("open"),t&&t.classList.add("hidden");let n=e.querySelector(".prompt-input");n&&n.focus()}function Ut(e,t){e.classList.remove("open"),t&&t.classList.remove("hidden"),me(e),pe(e)}function pe(e){let t=e.querySelector(".generation-status"),n=e.querySelector(".generate-btn");if(t&&(t.style.display="none"),n){n.disabled=!1;let s=n.querySelector(".btn-text"),a=n.querySelector(".btn-loading");s&&(s.style.display="inline"),a&&(a.style.display="none")}}function ue(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function Gt(e,t){e.classList.add("expanded");let n=e.querySelector(".result-prompt-label");n&&(n.textContent=t||"")}function me(e){e.classList.remove("expanded");let t=e.querySelector(".result-content");t&&ue(t)}function Ht(e){return e.querySelector(".result-content")}function Vt(e,t){let n=e.querySelector(".history-section"),s=e.querySelector(".history-list");if(!(!n||!s)){if(ue(s),t.length===0){n.style.display="none";return}n.style.display="block",t.forEach(a=>{let o=document.createElement("div");o.className="history-item",o.setAttribute("data-history-id",a.id),o.setAttribute("data-template-id",a.templateId);let r=document.createElement("span");r.className="history-prompt-text",r.textContent=a.prompt;let i=document.createElement("span");i.className="history-badge",i.textContent=a.templateId;let c=document.createElement("button");c.className="history-delete",c.setAttribute("data-history-delete",a.id),c.textContent="\xD7",o.appendChild(r),o.appendChild(i),o.appendChild(c),s.appendChild(o)})}}function Qt(e,t){let n=e.querySelector(".prompt-view");if(!n)return;let s=n.querySelector(".quick-prompts");if(s&&s.remove(),!t||t.length===0)return;let a=document.createElement("div");a.className="quick-prompts";let o=document.createElement("div");o.className="quick-prompts-label",o.textContent="Try these examples:",a.appendChild(o),t.forEach(i=>{let c=document.createElement("button");c.className="quick-prompt",c.setAttribute("data-prompt",i.prompt),c.textContent=i.label,a.appendChild(c)});let r=n.querySelector(".generation-status");r?n.insertBefore(a,r):n.appendChild(a)}fe.exports={createPanel:_t,openPanel:Ft,closePanel:Ut,resetPanelState:pe,showResultView:Gt,showPromptView:me,getResultContainer:Ht,updateHistoryList:Vt,updateQuickPrompts:Qt}});var xe=u((ss,ve)=>{var ge={invoice:"invoices",overdue:"invoices",reminder:"invoices",health:"dashboard",dashboard:"dashboard",engagement:"dashboard",churn:"dashboard",archive:"archive",inactive:"archive",bulk:"archive",user:"archive"},Bt=["Analyzing request...","Mapping to capabilities...","Selecting components...","Generating UI...","Applying styles...","Done!"];function Xt(e){let t=e.toLowerCase();for(let[n,s]of Object.entries(ge))if(t.includes(n))return s;return"invoices"}function Yt(e){return e==="invoices"?be():e==="dashboard"?Jt():e==="archive"?Wt():be()}function be(){return`
    <div class="generated-header">
      <div class="generated-title">
        <h2>Overdue Invoices Over $500</h2>
        <span class="generated-badge">n.codes</span>
      </div>
      <button class="close-btn" data-ncodes-close>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Close
      </button>
    </div>
    <div class="generated-body">
      <table class="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Invoice #</th>
            <th>Amount</th>
            <th>Days Overdue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="customer-cell">
                <span class="avatar">AC</span>
                <div>
                  <div class="customer-name">Acme Corp</div>
                  <div class="customer-email">billing@acme.co</div>
                </div>
              </div>
            </td>
            <td class="mono">INV-2024-089</td>
            <td class="amount">$2,450.00</td>
            <td><span class="overdue-badge severe">45 days</span></td>
            <td><button class="action-btn remind">Send Reminder</button></td>
          </tr>
          <tr>
            <td>
              <div class="customer-cell">
                <span class="avatar">TI</span>
                <div>
                  <div class="customer-name">TechStart Inc</div>
                  <div class="customer-email">accounts@techstart.io</div>
                </div>
              </div>
            </td>
            <td class="mono">INV-2024-076</td>
            <td class="amount">$1,890.00</td>
            <td><span class="overdue-badge moderate">28 days</span></td>
            <td><button class="action-btn remind">Send Reminder</button></td>
          </tr>
          <tr>
            <td>
              <div class="customer-cell">
                <span class="avatar">GS</span>
                <div>
                  <div class="customer-name">Global Systems</div>
                  <div class="customer-email">finance@globalsys.com</div>
                </div>
              </div>
            </td>
            <td class="mono">INV-2024-092</td>
            <td class="amount">$3,200.00</td>
            <td><span class="overdue-badge severe">52 days</span></td>
            <td><button class="action-btn remind">Send Reminder</button></td>
          </tr>
          <tr>
            <td>
              <div class="customer-cell">
                <span class="avatar">NV</span>
                <div>
                  <div class="customer-name">Nova Ventures</div>
                  <div class="customer-email">ap@novaventures.co</div>
                </div>
              </div>
            </td>
            <td class="mono">INV-2024-081</td>
            <td class="amount">$875.00</td>
            <td><span class="overdue-badge mild">14 days</span></td>
            <td><button class="action-btn remind">Send Reminder</button></td>
          </tr>
          <tr>
            <td>
              <div class="customer-cell">
                <span class="avatar">SP</span>
                <div>
                  <div class="customer-name">Spark Partners</div>
                  <div class="customer-email">billing@sparkpartners.io</div>
                </div>
              </div>
            </td>
            <td class="mono">INV-2024-067</td>
            <td class="amount">$4,100.00</td>
            <td><span class="overdue-badge severe">61 days</span></td>
            <td><button class="action-btn remind">Send Reminder</button></td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <span class="table-info">Showing 5 invoices totaling $12,515.00</span>
        <button class="action-btn primary">Send All Reminders</button>
      </div>
    </div>
  `}function Jt(){return`
    <div class="generated-header">
      <div class="generated-title">
        <h2>Customer Health Dashboard</h2>
        <span class="generated-badge">n.codes</span>
      </div>
      <button class="close-btn" data-ncodes-close>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Close
      </button>
    </div>
    <div class="generated-body">
      <div class="health-stats">
        <div class="health-stat healthy">
          <div class="health-stat-value">847</div>
          <div class="health-stat-label">Healthy</div>
          <div class="health-bar"><div class="health-bar-fill" style="width:66%"></div></div>
        </div>
        <div class="health-stat at-risk">
          <div class="health-stat-value">312</div>
          <div class="health-stat-label">At Risk</div>
          <div class="health-bar"><div class="health-bar-fill" style="width:24%"></div></div>
        </div>
        <div class="health-stat churning">
          <div class="health-stat-value">125</div>
          <div class="health-stat-label">Churning</div>
          <div class="health-bar"><div class="health-bar-fill" style="width:10%"></div></div>
        </div>
      </div>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Top At-Risk Customers</h3>
          <div class="risk-list">
            <div class="risk-item">
              <div class="risk-customer"><span class="avatar small">MC</span><span>MegaCorp Ltd</span></div>
              <div class="risk-score high">23%</div>
            </div>
            <div class="risk-item">
              <div class="risk-customer"><span class="avatar small">DF</span><span>DataFlow Inc</span></div>
              <div class="risk-score high">31%</div>
            </div>
            <div class="risk-item">
              <div class="risk-customer"><span class="avatar small">QS</span><span>QuickServe</span></div>
              <div class="risk-score medium">45%</div>
            </div>
            <div class="risk-item">
              <div class="risk-customer"><span class="avatar small">BT</span><span>BlueTech</span></div>
              <div class="risk-score medium">52%</div>
            </div>
          </div>
        </div>
        <div class="dashboard-card">
          <h3>Engagement Trends</h3>
          <div class="mini-chart">
            <div class="chart-bar" style="height:40%"></div>
            <div class="chart-bar" style="height:55%"></div>
            <div class="chart-bar" style="height:45%"></div>
            <div class="chart-bar" style="height:70%"></div>
            <div class="chart-bar" style="height:65%"></div>
            <div class="chart-bar" style="height:80%"></div>
            <div class="chart-bar" style="height:75%"></div>
          </div>
          <div class="chart-labels">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
      <div class="dashboard-actions">
        <button class="action-btn secondary">Export Report</button>
        <button class="action-btn primary">Schedule Outreach</button>
      </div>
    </div>
  `}function Wt(){return`
    <div class="generated-header">
      <div class="generated-title">
        <h2>Bulk Archive Inactive Users</h2>
        <span class="generated-badge">n.codes</span>
      </div>
      <button class="close-btn" data-ncodes-close>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Close
      </button>
    </div>
    <div class="generated-body">
      <div class="archive-info">
        <span class="archive-stat-value">234</span>
        <span class="archive-stat-label">users inactive for 90+ days</span>
      </div>
      <div class="selection-header">
        <label class="checkbox-label">
          <input type="checkbox" checked data-ncodes-select-all>
          <span>Select All (234)</span>
        </label>
        <span class="selection-count">234 selected</span>
      </div>
      <table class="data-table selectable">
        <thead>
          <tr><th width="40"></th><th>User</th><th>Last Active</th><th>Account Type</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" checked class="row-checkbox"></td>
            <td><div class="customer-cell"><span class="avatar">JD</span><div><div class="customer-name">John Doe</div><div class="customer-email">john.doe@example.com</div></div></div></td>
            <td class="muted">Oct 15, 2024</td>
            <td><span class="type-badge">Free</span></td>
            <td><span class="status-badge inactive">Inactive</span></td>
          </tr>
          <tr>
            <td><input type="checkbox" checked class="row-checkbox"></td>
            <td><div class="customer-cell"><span class="avatar">SJ</span><div><div class="customer-name">Sarah Johnson</div><div class="customer-email">sarah.j@company.co</div></div></div></td>
            <td class="muted">Sep 28, 2024</td>
            <td><span class="type-badge">Pro</span></td>
            <td><span class="status-badge inactive">Inactive</span></td>
          </tr>
          <tr>
            <td><input type="checkbox" checked class="row-checkbox"></td>
            <td><div class="customer-cell"><span class="avatar">MK</span><div><div class="customer-name">Mike Kim</div><div class="customer-email">m.kim@startup.io</div></div></div></td>
            <td class="muted">Sep 12, 2024</td>
            <td><span class="type-badge">Free</span></td>
            <td><span class="status-badge inactive">Inactive</span></td>
          </tr>
          <tr>
            <td><input type="checkbox" checked class="row-checkbox"></td>
            <td><div class="customer-cell"><span class="avatar">EW</span><div><div class="customer-name">Emma Wilson</div><div class="customer-email">emma@agency.com</div></div></div></td>
            <td class="muted">Aug 30, 2024</td>
            <td><span class="type-badge">Team</span></td>
            <td><span class="status-badge inactive">Inactive</span></td>
          </tr>
          <tr>
            <td><input type="checkbox" checked class="row-checkbox"></td>
            <td><div class="customer-cell"><span class="avatar">RL</span><div><div class="customer-name">Robert Lee</div><div class="customer-email">rlee@corp.net</div></div></div></td>
            <td class="muted">Aug 15, 2024</td>
            <td><span class="type-badge">Free</span></td>
            <td><span class="status-badge inactive">Inactive</span></td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <span class="table-info">Showing 5 of 234 inactive users</span>
        <div class="archive-actions">
          <button class="action-btn secondary">Cancel</button>
          <button class="action-btn danger">Archive 234 Users</button>
        </div>
      </div>
    </div>
  `}ve.exports={PROMPT_TEMPLATES:ge,STATUS_MESSAGES:Bt,findTemplate:Xt,getTemplateHTML:Yt}});var Ee=u((os,Ce)=>{function Kt(e,t){ye(e);let a=new DOMParser().parseFromString(t,"text/html").body.childNodes;for(;a.length>0;)e.appendChild(a[0]);return we(e),e}function ye(e){if(e)for(;e.firstChild;)e.removeChild(e.firstChild)}function we(e){let t=e.querySelectorAll(".action-btn.remind");t.forEach(o=>{o.addEventListener("click",function(){let r=this.textContent;this.textContent="Sent!",this.style.background="var(--ncodes-accent)",this.style.color="#000",this.disabled=!0,setTimeout(()=>{this.textContent=r,this.style.background="",this.style.color="",this.disabled=!1},2e3)})});let n=e.querySelector(".action-btn.primary");n&&n.textContent.includes("Send All")&&n.addEventListener("click",function(){let o=this.textContent;this.textContent="All reminders sent!",this.disabled=!0,t.forEach(r=>{r.textContent="Sent!",r.style.background="var(--ncodes-accent)",r.style.color="#000",r.disabled=!0}),setTimeout(()=>{this.textContent=o,this.disabled=!1,t.forEach(r=>{r.textContent="Send Reminder",r.style.background="",r.style.color="",r.disabled=!1})},2e3)});let s=e.querySelector(".action-btn.danger");s&&s.addEventListener("click",function(){this.textContent="Archived!",this.style.background="var(--ncodes-accent)",this.disabled=!0});let a=e.querySelector("[data-ncodes-select-all]");a&&a.addEventListener("change",function(){let o=e.querySelectorAll(".row-checkbox"),r=e.querySelector(".selection-count");o.forEach(i=>{i.checked=this.checked}),r&&(r.textContent=this.checked?"234 selected":"0 selected")})}Ce.exports={renderGeneratedUI:Kt,clearRenderedUI:ye,setupActionHandlers:we}});var Se=u((rs,ke)=>{var C="ncodes:history";function U(){try{let e=localStorage.getItem(C);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function Zt({prompt:e,templateId:t,dsl:n}){let s=U(),a={id:String(Date.now()),prompt:e,templateId:t||null,timestamp:Date.now()};return n&&(a.dsl=n),s.unshift(a),s.length>20&&(s.length=20),localStorage.setItem(C,JSON.stringify(s)),a}function en(e){let t=U().filter(n=>n.id!==e);return localStorage.setItem(C,JSON.stringify(t)),t}function tn(){localStorage.removeItem(C)}ke.exports={getHistory:U,addToHistory:Zt,removeFromHistory:en,clearHistory:tn,STORAGE_KEY:C,MAX_ENTRIES:20}});var Oe=u((is,Me)=>{"use strict";var Ae=["page","data-table","detail-view","form","summary-cards","chart","list","text","empty-state","error"],Ne=["string","number","date","boolean","badge"],$e=["string","number","date","boolean","badge","link"],Te=["text","email","number","date","select","textarea","checkbox"],Le=["bar","line","pie","doughnut"],qe=["heading","paragraph","caption","code"],ze=["up","down","neutral"],Ie=/^(#|\/|https?:\/\/)/,G=["form"],De={page:["title","children"],"data-table":["columns","rows"],"detail-view":["fields"],form:["fields","submitLabel"],"summary-cards":["cards"],chart:["chartType","labels","datasets"],list:["items"],text:["content"],"empty-state":["message"],error:["message"]},je={"data-table":["rows"],"detail-view":["fields"],"summary-cards":["cards"],chart:["labels","datasets"],list:["items"]},nn=["data-table","detail-view","summary-cards","chart","list"],an=["form"];function sn(e){let t=[];return e==null||typeof e!="object"||Array.isArray(e)?{valid:!1,errors:["DSL document must be a non-null object"]}:(e.type!=="page"&&t.push(`Root component must be of type "page", got "${e.type||"(missing)"}"`),Pe(e,"root",t,0),{valid:t.length===0,errors:t})}function Pe(e,t,n,s){if(s>10){n.push(`${t}: maximum nesting depth of 10 exceeded`);return}if(typeof e!="object"||e===null||Array.isArray(e)){n.push(`${t}: component must be a non-null object`);return}if(!e.type){n.push(`${t}: missing required field "type"`);return}if(typeof e.type!="string"){n.push(`${t}: "type" must be a string`);return}if(!Ae.includes(e.type)){n.push(`${t}: unknown component type "${e.type}"`);return}let a=De[e.type],o=e.query&&je[e.type]||[];for(let r of a)o.includes(r)||(e[r]===void 0||e[r]===null)&&n.push(`${t} (${e.type}): missing required prop "${r}"`);switch(e.type){case"page":on(e,t,n,s);break;case"data-table":rn(e,t,n);break;case"detail-view":dn(e,t,n);break;case"form":cn(e,t,n);break;case"summary-cards":ln(e,t,n);break;case"chart":pn(e,t,n);break;case"list":un(e,t,n);break;case"text":mn(e,t,n);break;case"empty-state":fn(e,t,n);break;case"error":hn(e,t,n);break}}function w(e,t,n){if(typeof e!="object"||e===null||Array.isArray(e)){n.push(`${t}.query: must be an object`);return}if((!e.ref||typeof e.ref!="string")&&n.push(`${t}.query: "ref" must be a non-empty string`),e.params!==void 0)if(typeof e.params!="object"||e.params===null||Array.isArray(e.params))n.push(`${t}.query.params: must be a plain object`);else for(let[s,a]of Object.entries(e.params))a!==null&&typeof a=="object"&&n.push(`${t}.query.params.${s}: must be a primitive value`);e.responsePath!==void 0&&typeof e.responsePath!="string"&&n.push(`${t}.query.responsePath: must be a string`)}function Re(e,t,n){if(typeof e!="object"||e===null||Array.isArray(e)){n.push(`${t}.action: must be an object`);return}if((!e.ref||typeof e.ref!="string")&&n.push(`${t}.action: "ref" must be a non-empty string`),e.bodyFrom!==void 0&&(G.includes(e.bodyFrom)||n.push(`${t}.action.bodyFrom: must be one of: ${G.join(", ")}`)),e.params!==void 0)if(typeof e.params!="object"||e.params===null||Array.isArray(e.params))n.push(`${t}.action.params: must be a plain object`);else for(let[s,a]of Object.entries(e.params))a!==null&&typeof a=="object"&&n.push(`${t}.action.params.${s}: must be a primitive value`);e.responsePath!==void 0&&typeof e.responsePath!="string"&&n.push(`${t}.action.responsePath: must be a string`)}function on(e,t,n,s){if(e.title!==void 0&&typeof e.title!="string"&&n.push(`${t} (page): "title" must be a string`),e.description!==void 0&&typeof e.description!="string"&&n.push(`${t} (page): "description" must be a string`),e.children!==void 0&&e.children!==null)if(!Array.isArray(e.children))n.push(`${t} (page): "children" must be an array`);else for(let a=0;a<e.children.length;a++)Pe(e.children[a],`${t}.children[${a}]`,n,s+1)}function rn(e,t,n){if(e.query!==void 0&&w(e.query,t,n),e.columns!==void 0&&e.columns!==null)if(!Array.isArray(e.columns))n.push(`${t} (data-table): "columns" must be an array`);else{e.columns.length===0&&n.push(`${t} (data-table): "columns" must have at least 1 item`);for(let s=0;s<e.columns.length;s++){let a=e.columns[s];if(typeof a!="object"||a===null){n.push(`${t} (data-table): columns[${s}] must be an object`);continue}a.key||n.push(`${t} (data-table): columns[${s}] missing "key"`),a.label||n.push(`${t} (data-table): columns[${s}] missing "label"`),a.type&&!Ne.includes(a.type)&&n.push(`${t} (data-table): columns[${s}] invalid type "${a.type}"`)}}if(e.rows!==void 0&&e.rows!==null)if(!Array.isArray(e.rows))n.push(`${t} (data-table): "rows" must be an array`);else for(let s=0;s<e.rows.length;s++){let a=e.rows[s];if(typeof a!="object"||a===null||Array.isArray(a)){n.push(`${t} (data-table): rows[${s}] must be a plain object`);continue}for(let[o,r]of Object.entries(a))r!==null&&typeof r=="object"&&n.push(`${t} (data-table): rows[${s}].${o} must be a primitive value`)}}function dn(e,t,n){if(e.query!==void 0&&w(e.query,t,n),e.fields!==void 0&&e.fields!==null)if(!Array.isArray(e.fields))n.push(`${t} (detail-view): "fields" must be an array`);else{e.fields.length===0&&n.push(`${t} (detail-view): "fields" must have at least 1 item`);for(let s=0;s<e.fields.length;s++){let a=e.fields[s];if(typeof a!="object"||a===null){n.push(`${t} (detail-view): fields[${s}] must be an object`);continue}a.key||n.push(`${t} (detail-view): fields[${s}] missing "key"`),a.label||n.push(`${t} (detail-view): fields[${s}] missing "label"`),a.value===void 0?n.push(`${t} (detail-view): fields[${s}] missing "value"`):a.value!==null&&typeof a.value=="object"&&n.push(`${t} (detail-view): fields[${s}].value must be a string, number, boolean, or null`),a.type&&!$e.includes(a.type)&&n.push(`${t} (detail-view): fields[${s}] invalid type "${a.type}"`)}}}function cn(e,t,n){if(e.fields!==void 0&&e.fields!==null)if(!Array.isArray(e.fields))n.push(`${t} (form): "fields" must be an array`);else{e.fields.length===0&&n.push(`${t} (form): "fields" must have at least 1 item`);for(let s=0;s<e.fields.length;s++){let a=e.fields[s];if(typeof a!="object"||a===null){n.push(`${t} (form): fields[${s}] must be an object`);continue}if(a.name||n.push(`${t} (form): fields[${s}] missing "name"`),a.label||n.push(`${t} (form): fields[${s}] missing "label"`),a.type?Te.includes(a.type)||n.push(`${t} (form): fields[${s}] invalid type "${a.type}"`):n.push(`${t} (form): fields[${s}] missing "type"`),a.type==="select"&&a.options!==void 0)if(!Array.isArray(a.options))n.push(`${t} (form): fields[${s}].options must be an array`);else for(let o=0;o<a.options.length;o++){let r=a.options[o];typeof r!="object"||r===null?n.push(`${t} (form): fields[${s}].options[${o}] must be an object`):(r.label||n.push(`${t} (form): fields[${s}].options[${o}] missing "label"`),r.value||n.push(`${t} (form): fields[${s}].options[${o}] missing "value"`))}}}e.submitLabel!==void 0&&typeof e.submitLabel!="string"&&n.push(`${t} (form): "submitLabel" must be a string`),e.action!==void 0&&e.action!==null&&(typeof e.action=="string"||(typeof e.action=="object"?Re(e.action,t,n):n.push(`${t} (form): "action" must be a string or action-binding object`)))}function ln(e,t,n){if(e.query!==void 0&&w(e.query,t,n),e.cards!==void 0&&e.cards!==null)if(!Array.isArray(e.cards))n.push(`${t} (summary-cards): "cards" must be an array`);else{e.cards.length===0&&n.push(`${t} (summary-cards): "cards" must have at least 1 item`);for(let s=0;s<e.cards.length;s++){let a=e.cards[s];if(typeof a!="object"||a===null){n.push(`${t} (summary-cards): cards[${s}] must be an object`);continue}a.label||n.push(`${t} (summary-cards): cards[${s}] missing "label"`),a.value===void 0?n.push(`${t} (summary-cards): cards[${s}] missing "value"`):a.value!==null&&typeof a.value=="object"&&n.push(`${t} (summary-cards): cards[${s}].value must be a string, number, boolean, or null`),a.trend&&!ze.includes(a.trend)&&n.push(`${t} (summary-cards): cards[${s}] invalid trend "${a.trend}"`)}}}function pn(e,t,n){if(e.query!==void 0&&w(e.query,t,n),e.chartType&&!Le.includes(e.chartType)&&n.push(`${t} (chart): invalid chartType "${e.chartType}"`),e.labels!==void 0&&e.labels!==null&&(Array.isArray(e.labels)||n.push(`${t} (chart): "labels" must be an array`)),e.datasets!==void 0&&e.datasets!==null)if(!Array.isArray(e.datasets))n.push(`${t} (chart): "datasets" must be an array`);else{e.datasets.length===0&&n.push(`${t} (chart): "datasets" must have at least 1 item`);for(let s=0;s<e.datasets.length;s++){let a=e.datasets[s];if(typeof a!="object"||a===null){n.push(`${t} (chart): datasets[${s}] must be an object`);continue}a.label||n.push(`${t} (chart): datasets[${s}] missing "label"`),Array.isArray(a.data)||n.push(`${t} (chart): datasets[${s}] missing or invalid "data" array`)}}}function un(e,t,n){if(e.query!==void 0&&w(e.query,t,n),e.items!==void 0&&e.items!==null)if(!Array.isArray(e.items))n.push(`${t} (list): "items" must be an array`);else for(let s=0;s<e.items.length;s++){let a=e.items[s];if(typeof a!="object"||a===null){n.push(`${t} (list): items[${s}] must be an object`);continue}a.text||n.push(`${t} (list): items[${s}] missing "text"`)}}function mn(e,t,n){e.content!==void 0&&typeof e.content!="string"&&n.push(`${t} (text): "content" must be a string`),e.variant&&!qe.includes(e.variant)&&n.push(`${t} (text): invalid variant "${e.variant}"`)}function fn(e,t,n){e.message!==void 0&&typeof e.message!="string"&&n.push(`${t} (empty-state): "message" must be a string`),e.action!==void 0&&e.action!==null&&(typeof e.action!="object"||Array.isArray(e.action)?n.push(`${t} (empty-state): "action" must be an object`):(e.action.label||n.push(`${t} (empty-state): action missing "label"`),e.action.href!==void 0&&typeof e.action.href=="string"&&(Ie.test(e.action.href)||n.push(`${t} (empty-state): action.href must start with "#", "/", "http://", or "https://"`))))}function hn(e,t,n){e.message!==void 0&&typeof e.message!="string"&&n.push(`${t} (error): "message" must be a string`)}Me.exports={COMPONENT_TYPES:Ae,COLUMN_TYPES:Ne,FIELD_VIEW_TYPES:$e,FORM_FIELD_TYPES:Te,CHART_TYPES:Le,TEXT_VARIANTS:qe,TREND_DIRECTIONS:ze,SAFE_HREF_PATTERN:Ie,MAX_NESTING_DEPTH:10,REQUIRED_PROPS:De,QUERY_OPTIONAL_PROPS:je,QUERY_COMPONENTS:nn,ACTION_COMPONENTS:an,ACTION_BODY_FROM_VALUES:G,validateDSL:sn,validateQueryBinding:w,validateActionBinding:Re}});var Fe=u((ds,_e)=>{"use strict";function bn(e,t){let n=document.createElement("div");if(n.className="ncodes-dsl-page",e.title){let s=document.createElement("h2");s.className="ncodes-dsl-page-title",s.textContent=e.title,n.appendChild(s)}if(e.description){let s=document.createElement("p");s.className="ncodes-dsl-page-desc",s.textContent=e.description,n.appendChild(s)}if(Array.isArray(e.children))for(let s of e.children){let a=t(s);a&&n.appendChild(a)}return n}_e.exports={renderPage:bn}});var v=u((cs,Ve)=>{"use strict";function gn(e={}){let{baseURL:t="",fetchFn:n}=e,s=n||globalThis.fetch;return{executeQuery:(a,o)=>Ue(s,t,a,o),executeAction:(a,o,r)=>Ge(s,t,a,o,r)}}async function Ue(e,t,n,s){let a=n&&n.endpoint;if(!a||!a.path)throw new g("Missing resolved endpoint for query",0,null);let o=(a.method||"GET").toUpperCase(),r=s&&s.params||{},i=s&&s.responsePath,c,l;o==="GET"?(c=He(t+a.path,r),l={method:"GET",credentials:"include"}):(c=t+a.path,l={method:o,headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"});let p=await e(c,l);if(!p.ok){let f=await p.json().catch(()=>({}));throw new g(f.error||`Query failed (${p.status})`,p.status,f)}let m=await p.json();return H(m,i)}async function Ge(e,t,n,s,a){let o=n&&n.endpoint;if(!o||!o.path)throw new g("Missing resolved endpoint for action",0,null);let r=(o.method||"POST").toUpperCase(),i=s&&s.responsePath,c={};s&&s.bodyFrom==="form"&&a&&(c={...a}),s&&s.params&&(c={...c,...s.params});let l=await e(t+o.path,{method:r,headers:{"Content-Type":"application/json"},body:JSON.stringify(c),credentials:"include"});if(!l.ok){let m=await l.json().catch(()=>({}));throw new g(m.error||`Action failed (${l.status})`,l.status,m)}let p=await l.json();return H(p,i)}function H(e,t){if(!t)return e;let n=t.split("."),s=e;for(let a of n){if(s==null||typeof s!="object")return;s=s[a]}return s}function He(e,t){if(!t||Object.keys(t).length===0)return e;let n=new URLSearchParams;for(let[a,o]of Object.entries(t))o!=null&&n.append(a,String(o));let s=e.includes("?")?"&":"?";return e+s+n.toString()}var g=class extends Error{constructor(t,n,s){super(t),this.name="DataClientError",this.status=n,this.data=s}};Ve.exports={createDataClient:gn,executeQuery:Ue,executeAction:Ge,extractResponseData:H,buildQueryURL:He,DataClientError:g}});var x=u((ls,Qe)=>{"use strict";function vn(e){let t=document.createElement("div");return t.className="ncodes-dsl-loading",t.textContent=e||"Loading...",t}function xn(e){let t=document.createElement("div");return t.className="ncodes-dsl-inline-error",t.textContent=e||"Something went wrong.",t}function yn(e){let t=document.createElement("div");return t.className="ncodes-dsl-inline-success",t.textContent=e||"Done!",t}function wn(e){return!!(e&&e.query&&e.resolved&&e.resolved.endpoint)}function Cn(e){return!!(e&&e.action&&typeof e.action=="object"&&e.resolved&&e.resolved.endpoint)}Qe.exports={createLoadingElement:vn,createErrorElement:xn,createSuccessElement:yn,hasLiveQuery:wn,hasLiveAction:Cn}});var Ye=u((ps,Xe)=>{"use strict";var{createDataClient:En}=v(),{createLoadingElement:kn,createErrorElement:Sn,hasLiveQuery:An}=x();function Nn(e){let t=document.createElement("div");if(t.className="ncodes-dsl-data-table-wrapper",e.title){let n=document.createElement("h3");n.className="ncodes-dsl-section-title",n.textContent=e.title,t.appendChild(n)}return An(e)?(t.appendChild(kn()),$n(t,e)):t.appendChild(Be(e.columns||[],e.rows||[])),t}async function $n(e,t){let n=e.querySelector(".ncodes-dsl-loading");try{let a=await En().executeQuery(t.resolved,t.query);n&&n.remove();let o=Array.isArray(a)?a:[];if(o.length===0){let r=document.createElement("div");r.className="ncodes-dsl-inline-empty",r.textContent="No data found.",e.appendChild(r)}else e.appendChild(Be(t.columns||[],o))}catch(s){n&&n.remove(),e.appendChild(Sn(s.message))}}function Be(e,t){let n=document.createElement("table");n.className="data-table ncodes-dsl-data-table";let s=document.createElement("thead"),a=document.createElement("tr");for(let r of e){let i=document.createElement("th");i.textContent=r.label||r.key,a.appendChild(i)}s.appendChild(a),n.appendChild(s);let o=document.createElement("tbody");for(let r of t){let i=document.createElement("tr");for(let c of e){let l=document.createElement("td"),p=r[c.key];if(c.type==="badge"&&p!=null){let m=document.createElement("span");m.className="ncodes-dsl-badge",m.textContent=String(p),m.dataset.value=String(p).toLowerCase(),l.appendChild(m)}else l.textContent=p!=null?String(p):"";i.appendChild(l)}o.appendChild(i)}return n.appendChild(o),n}Xe.exports={renderDataTable:Nn}});var We=u((us,Je)=>{"use strict";var{createDataClient:Tn}=v(),{createLoadingElement:Ln,createErrorElement:qn,hasLiveQuery:zn}=x();function In(e){let t=document.createElement("div");if(t.className="ncodes-dsl-detail-view",e.title){let n=document.createElement("h3");n.className="ncodes-dsl-section-title",n.textContent=e.title,t.appendChild(n)}return zn(e)?(t.appendChild(Ln()),Dn(t,e)):t.appendChild(V(e.fields||[])),t}async function Dn(e,t){let n=e.querySelector(".ncodes-dsl-loading");try{let a=await Tn().executeQuery(t.resolved,t.query);n&&n.remove();let o=t.fields||[];if(a&&typeof a=="object"){let r=o.map(i=>({...i,value:a[i.key]!=null?a[i.key]:i.value}));e.appendChild(V(r))}else e.appendChild(V(o))}catch(s){n&&n.remove(),e.appendChild(qn(s.message))}}function V(e){let t=document.createElement("dl");t.className="ncodes-dsl-detail-list";for(let n of e){let s=document.createElement("dt");s.textContent=n.label||n.key,t.appendChild(s);let a=document.createElement("dd");if(n.type==="badge"&&n.value!=null){let o=document.createElement("span");o.className="ncodes-dsl-badge",o.textContent=String(n.value),o.dataset.value=String(n.value).toLowerCase(),a.appendChild(o)}else if(n.type==="link"&&n.value!=null){let o=document.createElement("a");o.textContent=String(n.value),o.href="#",o.className="ncodes-dsl-link",a.appendChild(o)}else a.textContent=n.value!=null?String(n.value):"";t.appendChild(a)}return t}Je.exports={renderDetailView:In}});var Ze=u((fs,Ke)=>{"use strict";var{createDataClient:jn}=v(),{createLoadingElement:ms,createErrorElement:Pn,createSuccessElement:Rn,hasLiveAction:Mn}=x();function On(e){let t=document.createElement("div");if(t.className="ncodes-dsl-form-wrapper",e.title){let a=document.createElement("h3");a.className="ncodes-dsl-section-title",a.textContent=e.title,t.appendChild(a)}let n=document.createElement("form");n.className="ncodes-dsl-form";let s=e.fields||[];for(let a of s){let o=document.createElement("div");o.className="ncodes-dsl-form-group";let r=document.createElement("label");if(r.textContent=a.label||a.name,r.setAttribute("for",`ncodes-field-${a.name}`),a.required){let c=document.createElement("span");c.className="ncodes-dsl-required",c.textContent=" *",r.appendChild(c)}o.appendChild(r);let i;if(a.type==="textarea")i=document.createElement("textarea"),i.rows=3;else if(a.type==="select"){i=document.createElement("select");let c=document.createElement("option");if(c.value="",c.textContent=a.placeholder||`Select ${a.label||a.name}`,i.appendChild(c),Array.isArray(a.options))for(let l of a.options){let p=document.createElement("option");p.value=l.value,p.textContent=l.label,i.appendChild(p)}}else a.type==="checkbox"?(i=document.createElement("input"),i.type="checkbox"):(i=document.createElement("input"),i.type=a.type||"text");i.id=`ncodes-field-${a.name}`,i.name=a.name,a.placeholder&&a.type!=="select"&&a.type!=="checkbox"&&(i.placeholder=a.placeholder),a.required&&(i.required=!0),i.className="ncodes-dsl-form-control",o.appendChild(i),n.appendChild(o)}if(e.submitLabel){let a=document.createElement("button");a.type="submit",a.className="ncodes-dsl-submit-btn",a.textContent=e.submitLabel,e.action&&typeof e.action=="string"&&(a.dataset.action=e.action),n.appendChild(a)}return Mn(e)?n.addEventListener("submit",a=>{a.preventDefault(),_n(n,t,e)}):n.addEventListener("submit",a=>a.preventDefault()),t.appendChild(n),t}async function _n(e,t,n){if(!e.checkValidity()){e.reportValidity();return}let s=t.querySelector(".ncodes-dsl-inline-error, .ncodes-dsl-inline-success");s&&s.remove();let a=e.querySelector(".ncodes-dsl-submit-btn"),o=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Submitting...");try{let r=Fn(e,n.fields||[]);await jn().executeAction(n.resolved,n.action,r),t.appendChild(Rn("Submitted successfully.")),e.reset()}catch(r){t.appendChild(Pn(r.message))}finally{a&&(a.disabled=!1,a.textContent=o)}}function Fn(e,t){let n={};for(let s of t){let a=e.elements[s.name];a&&(s.type==="checkbox"?n[s.name]=a.checked:n[s.name]=a.value)}return n}Ke.exports={renderForm:On}});var nt=u((hs,tt)=>{"use strict";var{createDataClient:Un}=v(),{createLoadingElement:Gn,createErrorElement:Hn,hasLiveQuery:Vn}=x();function Qn(e){let t=document.createElement("div");if(t.className="ncodes-dsl-summary-cards-wrapper",e.title){let n=document.createElement("h3");n.className="ncodes-dsl-section-title",n.textContent=e.title,t.appendChild(n)}return Vn(e)?(t.appendChild(Gn()),Bn(t,e)):t.appendChild(et(e.cards||[])),t}async function Bn(e,t){let n=e.querySelector(".ncodes-dsl-loading");try{let a=await Un().executeQuery(t.resolved,t.query);n&&n.remove();let o=Array.isArray(a)?a:t.cards||[];e.appendChild(et(o))}catch(s){n&&n.remove(),e.appendChild(Hn(s.message))}}function et(e){let t=document.createElement("div");t.className="ncodes-dsl-summary-grid";for(let n of e){let s=document.createElement("div");s.className="ncodes-dsl-summary-card",n.trend&&(s.dataset.trend=n.trend);let a=document.createElement("div");a.className="ncodes-dsl-summary-value",a.textContent=n.value!=null?String(n.value):"",s.appendChild(a);let o=document.createElement("div");if(o.className="ncodes-dsl-summary-label",o.textContent=n.label||"",s.appendChild(o),n.change){let r=document.createElement("div");r.className="ncodes-dsl-summary-change",n.trend&&(r.dataset.trend=n.trend),r.textContent=n.change,s.appendChild(r)}t.appendChild(s)}return t}tt.exports={renderSummaryCards:Qn}});var ot=u((bs,st)=>{"use strict";var{createDataClient:Xn}=v(),{createLoadingElement:Yn,createErrorElement:Jn,hasLiveQuery:Wn}=x();function Kn(e){let t=document.createElement("div");if(t.className="ncodes-dsl-chart-wrapper",e.title){let n=document.createElement("h3");n.className="ncodes-dsl-section-title",n.textContent=e.title,t.appendChild(n)}return Wn(e)?(t.appendChild(Yn()),Zn(t,e)):at(t,e.chartType||"bar",e.labels||[],e.datasets||[]),t}async function Zn(e,t){let n=e.querySelector(".ncodes-dsl-loading");try{let a=await Xn().executeQuery(t.resolved,t.query);n&&n.remove();let o=t.chartType||"bar",r=t.labels||[],i=t.datasets||[];a&&typeof a=="object"&&(Array.isArray(a.labels)&&(r=a.labels),Array.isArray(a.datasets)&&(i=a.datasets)),at(e,o,r,i)}catch(s){n&&n.remove(),e.appendChild(Jn(s.message))}}function at(e,t,n,s){if(t==="bar"||t==="line"?e.appendChild(ea(t,n,s)):(t==="pie"||t==="doughnut")&&e.appendChild(ta(t,n,s)),s.length>0){let a=document.createElement("div");a.className="ncodes-dsl-chart-legend";for(let o=0;o<s.length;o++){let r=document.createElement("span");r.className="ncodes-dsl-chart-legend-item";let i=document.createElement("span");i.className="ncodes-dsl-chart-swatch",i.dataset.index=String(o),r.appendChild(i);let c=document.createTextNode(s[o].label||`Series ${o+1}`);r.appendChild(c),a.appendChild(r)}e.appendChild(a)}}function ea(e,t,n){let s=document.createElement("div");s.className=`ncodes-dsl-chart ncodes-dsl-chart--${e}`;let a=0;for(let i of n)for(let c of i.data||[])c>a&&(a=c);a===0&&(a=1);let o=document.createElement("div");o.className="ncodes-dsl-chart-bars";for(let i=0;i<t.length;i++){let c=document.createElement("div");c.className="ncodes-dsl-chart-bar-group";for(let l=0;l<n.length;l++){let p=(n[l].data||[])[i]||0,m=Math.round(p/a*100),f=document.createElement("div");f.className="ncodes-dsl-chart-bar",f.dataset.index=String(l),f.style.height=`${m}%`,f.title=`${n[l].label}: ${p}`,c.appendChild(f)}o.appendChild(c)}s.appendChild(o);let r=document.createElement("div");r.className="ncodes-dsl-chart-x-axis";for(let i of t){let c=document.createElement("span");c.textContent=i,r.appendChild(c)}return s.appendChild(r),s}function ta(e,t,n){let s=document.createElement("div");s.className=`ncodes-dsl-chart ncodes-dsl-chart--${e}`;let a=n[0]&&n[0].data||[],o=a.reduce((l,p)=>l+p,0)||1,r=document.createElement("div");r.className="ncodes-dsl-pie-container";let i=0,c=[];for(let l=0;l<a.length;l++){let p=a[l]/o*100;c.push({start:i,end:i+p,index:l}),i+=p}r.dataset.segments=JSON.stringify(c),r.dataset.chartType=e;for(let l=0;l<t.length;l++){let p=document.createElement("div");p.className="ncodes-dsl-pie-label";let m=Math.round(a[l]/o*100);p.textContent=`${t[l]}: ${a[l]} (${m}%)`,p.dataset.index=String(l),s.appendChild(p)}return s.insertBefore(r,s.firstChild),s}st.exports={renderChart:Kn}});var dt=u((gs,it)=>{"use strict";var{createDataClient:na}=v(),{createLoadingElement:aa,createErrorElement:sa,hasLiveQuery:oa}=x();function ra(e){let t=document.createElement("div");if(t.className="ncodes-dsl-list-wrapper",e.title){let n=document.createElement("h3");n.className="ncodes-dsl-section-title",n.textContent=e.title,t.appendChild(n)}return oa(e)?(t.appendChild(aa()),ia(t,e)):t.appendChild(rt(e.ordered,e.items||[])),t}async function ia(e,t){let n=e.querySelector(".ncodes-dsl-loading");try{let a=await na().executeQuery(t.resolved,t.query);n&&n.remove();let o=Array.isArray(a)?a:[];if(o.length===0){let r=document.createElement("div");r.className="ncodes-dsl-inline-empty",r.textContent="No items found.",e.appendChild(r)}else e.appendChild(rt(t.ordered,o))}catch(s){n&&n.remove(),e.appendChild(sa(s.message))}}function rt(e,t){let n=document.createElement(e?"ol":"ul");n.className="ncodes-dsl-list";for(let s of t){let a=document.createElement("li");a.className="ncodes-dsl-list-item";let o=document.createElement("span");if(o.className="ncodes-dsl-list-text",o.textContent=s.text||"",a.appendChild(o),s.secondary){let r=document.createElement("span");r.className="ncodes-dsl-list-secondary",r.textContent=s.secondary,a.appendChild(r)}n.appendChild(a)}return n}it.exports={renderList:ra}});var lt=u((vs,ct)=>{"use strict";var da={heading:"h3",paragraph:"p",caption:"small",code:"pre"};function ca(e){let t=e.variant||"paragraph",n=da[t]||"p",s=document.createElement(n);if(s.className=`ncodes-dsl-text ncodes-dsl-text-${t}`,e.title&&t!=="heading"){let a=document.createElement("div");a.className="ncodes-dsl-text-wrapper";let o=document.createElement("h3");return o.className="ncodes-dsl-section-title",o.textContent=e.title,a.appendChild(o),s.textContent=e.content||"",a.appendChild(s),a}return s.textContent=e.content||"",s}ct.exports={renderText:ca}});var ut=u((xs,pt)=>{"use strict";function la(e){let t=document.createElement("div");if(t.className="ncodes-dsl-empty-state",e.icon){let n=document.createElement("div");n.className="ncodes-dsl-empty-icon",n.textContent=pa(e.icon),t.appendChild(n)}if(e.title){let n=document.createElement("h3");n.className="ncodes-dsl-empty-title",n.textContent=e.title,t.appendChild(n)}if(e.message){let n=document.createElement("p");n.className="ncodes-dsl-empty-message",n.textContent=e.message,t.appendChild(n)}if(e.action&&e.action.label){let n=document.createElement("button");n.className="ncodes-dsl-empty-action",n.textContent=e.action.label,e.action.href&&(n.dataset.href=e.action.href),t.appendChild(n)}return t}function pa(e){return{search:"\u{1F50D}",empty:"\u{1F4ED}",error:"\u26A0\uFE0F",info:"\u2139\uFE0F",add:"\u2795"}[e]||"\u{1F4CB}"}pt.exports={renderEmptyState:la}});var ft=u((ys,mt)=>{"use strict";function ua(e){let t=document.createElement("div");t.className="ncodes-dsl-error";let n=document.createElement("div");n.className="ncodes-dsl-error-header";let s=document.createElement("span");if(s.className="ncodes-dsl-error-icon",s.textContent="\u26A0\uFE0F",n.appendChild(s),e.title){let a=document.createElement("h3");a.className="ncodes-dsl-error-title",a.textContent=e.title,n.appendChild(a)}if(t.appendChild(n),e.message){let a=document.createElement("p");a.className="ncodes-dsl-error-message",a.textContent=e.message,t.appendChild(a)}if(e.code){let a=document.createElement("code");a.className="ncodes-dsl-error-code",a.textContent=e.code,t.appendChild(a)}if(e.details){let a=document.createElement("pre");a.className="ncodes-dsl-error-details",a.textContent=e.details,t.appendChild(a)}if(e.retry){let a=document.createElement("button");a.className="ncodes-dsl-error-retry",a.textContent="Retry",t.appendChild(a)}return t}mt.exports={renderError:ua}});var gt=u((ws,bt)=>{"use strict";var{renderPage:ma}=Fe(),{renderDataTable:fa}=Ye(),{renderDetailView:ha}=We(),{renderForm:ba}=Ze(),{renderSummaryCards:ga}=nt(),{renderChart:va}=ot(),{renderList:xa}=dt(),{renderText:ya}=lt(),{renderEmptyState:wa}=ut(),{renderError:Ca}=ft(),ht={page:ma,"data-table":fa,"detail-view":ha,form:ba,"summary-cards":ga,chart:va,list:xa,text:ya,"empty-state":wa,error:Ca};function Q(e){if(!e||!e.type)return null;let t=ht[e.type];return t?e.type==="page"?t(e,Q):t(e):(console.warn(`[n.codes] Unknown DSL component type: "${e.type}"`),null)}function Ea(e,t){for(;e.firstChild;)e.removeChild(e.firstChild);let n=Q(t);return n&&e.appendChild(n),e}function ka(){return`
    /* ===== DSL Component Styles ===== */

    .ncodes-dsl-page {
      padding: 24px;
    }

    .ncodes-dsl-page-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 4px;
    }

    .ncodes-dsl-page-desc {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .ncodes-dsl-section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 12px;
    }

    /* ===== Data Table ===== */
    .ncodes-dsl-data-table-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .ncodes-dsl-data-table th {
      text-align: left;
      color: var(--ncodes-text-dim);
      font-weight: 500;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--ncodes-border-color);
    }

    .ncodes-dsl-data-table td {
      padding: 12px;
      color: var(--ncodes-text-muted);
      border-bottom: 1px solid var(--ncodes-border-light);
    }

    .ncodes-dsl-data-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* ===== Badge ===== */
    .ncodes-dsl-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-badge[data-value="done"],
    .ncodes-dsl-badge[data-value="completed"],
    .ncodes-dsl-badge[data-value="active"],
    .ncodes-dsl-badge[data-value="success"] {
      background: var(--ncodes-accent-dim);
      border-color: transparent;
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-badge[data-value="in-progress"],
    .ncodes-dsl-badge[data-value="pending"],
    .ncodes-dsl-badge[data-value="updated"],
    .ncodes-dsl-badge[data-value="warning"] {
      background: var(--ncodes-warning-dim);
      border-color: transparent;
      color: var(--ncodes-warning);
    }

    .ncodes-dsl-badge[data-value="overdue"],
    .ncodes-dsl-badge[data-value="error"],
    .ncodes-dsl-badge[data-value="failed"],
    .ncodes-dsl-badge[data-value="critical"] {
      background: var(--ncodes-danger-dim);
      border-color: transparent;
      color: var(--ncodes-danger);
    }

    /* ===== Detail View ===== */
    .ncodes-dsl-detail-view {
      margin-bottom: 20px;
    }

    .ncodes-dsl-detail-list {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
      font-size: 13px;
    }

    .ncodes-dsl-detail-list dt {
      color: var(--ncodes-text-dim);
      font-weight: 500;
    }

    .ncodes-dsl-detail-list dd {
      color: var(--ncodes-text-main);
    }

    .ncodes-dsl-link {
      color: var(--ncodes-accent);
      text-decoration: none;
    }

    .ncodes-dsl-link:hover {
      text-decoration: underline;
    }

    /* ===== Form ===== */
    .ncodes-dsl-form-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ncodes-dsl-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .ncodes-dsl-form-group label {
      font-size: 13px;
      font-weight: 500;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-required {
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-form-control {
      width: 100%;
      padding: 10px 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      color: var(--ncodes-text-main);
      font-size: 13px;
      font-family: var(--ncodes-font);
      transition: border-color 0.15s ease;
    }

    .ncodes-dsl-form-control:focus {
      outline: none;
      border-color: var(--ncodes-accent);
    }

    .ncodes-dsl-form-control::placeholder {
      color: var(--ncodes-text-dim);
    }

    textarea.ncodes-dsl-form-control {
      resize: vertical;
      min-height: 60px;
    }

    select.ncodes-dsl-form-control {
      appearance: auto;
    }

    input[type="checkbox"].ncodes-dsl-form-control {
      width: auto;
      accent-color: var(--ncodes-accent);
    }

    .ncodes-dsl-submit-btn {
      padding: 10px 20px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: background 0.15s ease;
      align-self: flex-start;
    }

    .ncodes-dsl-submit-btn:hover {
      background: var(--ncodes-accent-hover);
    }

    /* ===== Summary Cards ===== */
    .ncodes-dsl-summary-cards-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .ncodes-dsl-summary-card {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 10px;
      padding: 16px;
    }

    .ncodes-dsl-summary-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 4px;
    }

    .ncodes-dsl-summary-card[data-trend="up"] .ncodes-dsl-summary-value {
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-summary-card[data-trend="down"] .ncodes-dsl-summary-value {
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-summary-label {
      font-size: 12px;
      color: var(--ncodes-text-muted);
      margin-bottom: 8px;
    }

    .ncodes-dsl-summary-change {
      font-size: 11px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-summary-change[data-trend="up"] {
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-summary-change[data-trend="down"] {
      color: var(--ncodes-danger);
    }

    /* ===== Chart ===== */
    .ncodes-dsl-chart-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 120px;
      padding-bottom: 4px;
    }

    .ncodes-dsl-chart-bar-group {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 100%;
    }

    .ncodes-dsl-chart-bar {
      flex: 1;
      border-radius: 3px 3px 0 0;
      min-height: 4px;
      transition: opacity 0.15s ease;
    }

    .ncodes-dsl-chart-bar[data-index="0"] {
      background: var(--ncodes-accent);
    }

    .ncodes-dsl-chart-bar[data-index="1"] {
      background: rgba(56, 189, 248, 0.7);
    }

    .ncodes-dsl-chart-bar[data-index="2"] {
      background: rgba(139, 92, 246, 0.7);
    }

    .ncodes-dsl-chart-bar:hover {
      opacity: 0.8;
    }

    .ncodes-dsl-chart-x-axis {
      display: flex;
      justify-content: space-around;
      margin-top: 8px;
      font-size: 11px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-chart-legend {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      font-size: 11px;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-chart-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ncodes-dsl-chart-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }

    .ncodes-dsl-chart-swatch[data-index="0"] { background: var(--ncodes-accent); }
    .ncodes-dsl-chart-swatch[data-index="1"] { background: rgba(56, 189, 248, 0.7); }
    .ncodes-dsl-chart-swatch[data-index="2"] { background: rgba(139, 92, 246, 0.7); }

    .ncodes-dsl-pie-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        var(--ncodes-accent) 0% 33%,
        rgba(56, 189, 248, 0.7) 33% 66%,
        rgba(139, 92, 246, 0.7) 66% 100%
      );
      margin: 0 auto 12px;
    }

    .ncodes-dsl-chart--doughnut .ncodes-dsl-pie-container {
      position: relative;
    }

    .ncodes-dsl-chart--doughnut .ncodes-dsl-pie-container::after {
      content: '';
      position: absolute;
      top: 25%;
      left: 25%;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background: var(--ncodes-bg-card);
    }

    .ncodes-dsl-pie-label {
      font-size: 12px;
      color: var(--ncodes-text-muted);
      text-align: center;
      margin-bottom: 4px;
    }

    /* ===== List ===== */
    .ncodes-dsl-list-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    ol.ncodes-dsl-list {
      counter-reset: ncodes-list;
    }

    ol.ncodes-dsl-list .ncodes-dsl-list-item::before {
      counter-increment: ncodes-list;
      content: counter(ncodes-list) ".";
      color: var(--ncodes-text-dim);
      font-size: 12px;
      min-width: 20px;
    }

    .ncodes-dsl-list-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 10px 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      font-size: 13px;
    }

    .ncodes-dsl-list-text {
      color: var(--ncodes-text-main);
      flex: 1;
    }

    .ncodes-dsl-list-secondary {
      color: var(--ncodes-text-dim);
      font-size: 12px;
      flex-shrink: 0;
    }

    /* ===== Text ===== */
    .ncodes-dsl-text-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-text {
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .ncodes-dsl-text-heading {
      font-size: 16px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 12px;
    }

    .ncodes-dsl-text-paragraph {
      font-size: 14px;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-text-caption {
      font-size: 12px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-text-code {
      font-family: var(--ncodes-mono);
      font-size: 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      padding: 12px 16px;
      color: var(--ncodes-text-muted);
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* ===== Empty State ===== */
    .ncodes-dsl-empty-state {
      text-align: center;
      padding: 40px 20px;
      margin-bottom: 20px;
    }

    .ncodes-dsl-empty-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }

    .ncodes-dsl-empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 8px;
    }

    .ncodes-dsl-empty-message {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      max-width: 360px;
      margin: 0 auto 16px;
      line-height: 1.5;
    }

    .ncodes-dsl-empty-action {
      padding: 10px 20px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: background 0.15s ease;
    }

    .ncodes-dsl-empty-action:hover {
      background: var(--ncodes-accent-hover);
    }

    /* ===== Error ===== */
    .ncodes-dsl-error {
      background: var(--ncodes-danger-dim);
      border: 1px solid var(--ncodes-danger);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .ncodes-dsl-error-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-icon {
      font-size: 18px;
    }

    .ncodes-dsl-error-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-error-message {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-code {
      display: inline-block;
      font-family: var(--ncodes-mono);
      font-size: 12px;
      background: var(--ncodes-bg-body);
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--ncodes-text-dim);
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-details {
      font-family: var(--ncodes-mono);
      font-size: 11px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 6px;
      padding: 10px;
      color: var(--ncodes-text-dim);
      overflow-x: auto;
      white-space: pre-wrap;
      margin-bottom: 12px;
    }

    .ncodes-dsl-error-retry {
      padding: 8px 16px;
      background: var(--ncodes-danger);
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: opacity 0.15s ease;
    }

    .ncodes-dsl-error-retry:hover {
      opacity: 0.9;
    }

    /* ===== Live Data UI States ===== */
    .ncodes-dsl-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--ncodes-text-dim);
      padding: 12px 0;
    }

    .ncodes-dsl-loading::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid var(--ncodes-border-color);
      border-top-color: var(--ncodes-accent);
      border-radius: 50%;
      animation: ncodes-spin 0.6s linear infinite;
    }

    @keyframes ncodes-spin {
      to { transform: rotate(360deg); }
    }

    .ncodes-dsl-inline-error {
      font-size: 13px;
      color: var(--ncodes-danger);
      background: var(--ncodes-danger-dim);
      border: 1px solid var(--ncodes-danger);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 12px;
    }

    .ncodes-dsl-inline-success {
      font-size: 13px;
      color: var(--ncodes-accent);
      background: var(--ncodes-accent-dim);
      border: 1px solid var(--ncodes-accent);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 12px;
    }

    .ncodes-dsl-inline-empty {
      font-size: 13px;
      color: var(--ncodes-text-dim);
      padding: 20px 0;
      text-align: center;
    }

    .ncodes-dsl-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}bt.exports={renderComponent:Q,renderDSL:Ea,getDSLStyles:ka,RENDERERS:ht}});var yt=u((Cs,xt)=>{async function Sa(e,t,n={}){let{timeout:s=3e4,maxRetries:a=3,fetchFn:o}=n,r=o||globalThis.fetch,i;for(let c=0;c<=a;c++){if(c>0){let l=1e3*Math.pow(2,c-1);await Na(l)}try{return await Aa(r,e,t,s)}catch(l){if(i=l,l instanceof h&&l.status>=400&&l.status<500)throw l}}throw i}async function Aa(e,t,n,s){let a=new AbortController,o=setTimeout(()=>a.abort(),s);try{let r=await e(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:a.signal});if(!r.ok){let i=await r.json().catch(()=>({})),c=vt(r.status,i);throw new h(c,r.status,i)}return r.json()}catch(r){throw r instanceof h?r:r.name==="AbortError"?new h("Request timed out. The AI is taking too long to respond.",0,null):new h("Network error. Please check your connection and try again.",0,null)}finally{clearTimeout(o)}}function vt(e,t){let n=t&&t.error;return e===401?"API key is missing or invalid. Please check your configuration.":e===400?n||"Invalid request. Please try a different prompt.":e===422?"The AI generated an invalid response. Please try again.":e===429?"Rate limit exceeded. Please wait a moment and try again.":e>=500?"Server error. The AI service may be temporarily unavailable.":n||`Unexpected error (${e}).`}var h=class extends Error{constructor(t,n,s){super(t),this.name="GenerateError",this.status=n,this.data=s}};function Na(e){return new Promise(t=>setTimeout(t,e))}xt.exports={callGenerateAPI:Sa,GenerateError:h,classifyError:vt,DEFAULT_TIMEOUT:3e4,MAX_RETRIES:3,BASE_DELAY:1e3}});var Ka=u((Es,It)=>{var{mergeConfig:$a}=re(),{getStyles:Ta}=de(),{createTrigger:La}=le(),{createPanel:qa,openPanel:Ct,closePanel:P,showResultView:R,showPromptView:X,getResultContainer:k,updateHistoryList:za}=he(),{findTemplate:Ia,getTemplateHTML:Et,STATUS_MESSAGES:B}=xe(),{renderGeneratedUI:kt,clearRenderedUI:S}=Ee(),{getHistory:St,addToHistory:At,removeFromHistory:Da}=Se(),{validateDSL:ja}=Oe(),{renderDSL:Nt,getDSLStyles:Pa}=gt(),{callGenerateAPI:Ra,GenerateError:Ma}=yt(),d=null;function Oa(e){d&&zt();let t=$a(e);if(!t.user){d={config:t,mounted:!1};return}if(typeof CSS<"u"&&CSS.registerProperty)try{CSS.registerProperty({name:"--ncodes-glow-angle",syntax:"<angle>",initialValue:"0deg",inherits:!1})}catch{}let n=document.createElement("div");n.id="ncodes-root";let s=n.attachShadow({mode:"open"}),a=document.createElement("style"),o=t.theme==="auto"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t.theme;a.textContent=Ta(o)+Pa(),s.appendChild(a);let r=La(t,()=>{Ct(i,r)}),i=qa(t);s.appendChild(r),s.appendChild(i),document.body.appendChild(n),d={config:t,host:n,shadow:s,trigger:r,panel:i,mounted:!0,isGenerating:!1},_a(),M()}function _a(){if(!d||!d.mounted)return;let{panel:e,trigger:t}=d,n=e.querySelector("[data-ncodes-panel-close]");n&&n.addEventListener("click",()=>P(e,t));let s=e.querySelector(".generate-btn");s&&s.addEventListener("click",Y);let a=e.querySelector(".prompt-input");a&&a.addEventListener("keydown",i=>{i.key==="Enter"&&!i.shiftKey&&(i.preventDefault(),Y())}),Fa();let o=e.querySelector(".history-list");o&&o.addEventListener("click",Ga);let r=e.querySelector("[data-ncodes-back]");r&&r.addEventListener("click",Lt),document.addEventListener("keydown",$t),document.addEventListener("click",Tt)}function Fa(){if(!d||!d.mounted)return;d.panel.querySelectorAll(".quick-prompt").forEach(t=>{t.addEventListener("click",()=>{let n=d.panel.querySelector(".prompt-input");n&&(n.value=t.getAttribute("data-prompt"),n.focus())})})}function Ua(e){return Ia(e)}function $t(e){!d||!d.mounted||e.key==="Escape"&&d.panel.classList.contains("open")&&(d.panel.classList.contains("expanded")?Lt():P(d.panel,d.trigger))}function Tt(e){!d||!d.mounted||d.panel.classList.contains("open")&&!d.host.contains(e.target)&&P(d.panel,d.trigger)}function Lt(){if(!d||!d.mounted)return;let e=k(d.panel);S(e),X(d.panel)}function Ga(e){if(!d||!d.mounted)return;let t=e.target.closest("[data-history-delete]");if(t){e.stopPropagation();let s=t.getAttribute("data-history-delete");Da(s),M();return}let n=e.target.closest(".history-item");if(n){let s=n.getAttribute("data-history-id"),a=n.querySelector(".history-prompt-text"),o=a?a.textContent:"";Ha(s,o)}}function Ha(e,t){if(!d||!d.mounted)return;let s=St().find(o=>o.id===e),a=k(d.panel);if(S(a),s&&s.dsl)Nt(a,s.dsl);else{let o=s?s.templateId:"invoices",r=Et(o);kt(a,r)}R(d.panel,t)}async function Y(){if(!d||!d.mounted||d.isGenerating)return;let e=d.panel.querySelector(".prompt-input"),t=e?e.value.trim():"";if(!t)return;d.isGenerating=!0;let n=d.panel.querySelector(".generate-btn");if(n){n.disabled=!0;let o=n.querySelector(".btn-text"),r=n.querySelector(".btn-loading");o&&(o.style.display="none"),r&&(r.style.display="flex")}let{config:s}=d;s.mode==="live"?await Va(t,n,e):await qt(t,n,e),d.isGenerating=!1}async function Va(e,t,n){Qa();try{let{config:s}=d,a=await Ra(s.apiUrl,{prompt:e,provider:s.provider,model:s.model}),{valid:o,errors:r}=ja(a.dsl);if(!o)throw console.warn("[n.codes] Invalid DSL response:",r),new Ma("The AI generated an invalid response. Please try again.",422,null);At({prompt:e,dsl:a.dsl}),M(),wt();let i=k(d.panel);S(i),Nt(i,a.dsl),R(d.panel,e),E(t,n)}catch(s){wt(),console.warn("[n.codes] Live generation failed:",s.message),Ba(s.message,e,t,n)}}async function qt(e,t,n){await Xa();let s=Ua(e),a=Et(s);At({prompt:e,templateId:s}),M();let o=k(d.panel);S(o),kt(o,a),R(d.panel,e),E(t,n)}function E(e,t){if(e){e.disabled=!1;let s=e.querySelector(".btn-text"),a=e.querySelector(".btn-loading");s&&(s.style.display="inline"),a&&(a.style.display="none")}let n=d.panel.querySelector(".generation-status");n&&(n.style.display="none"),t&&(t.value="")}function Qa(){if(!d||!d.mounted)return;let e=d.panel.querySelector(".generation-status"),t=d.panel.querySelector(".status-text"),n=d.panel.querySelector(".status-icon");e&&(e.style.display="block"),t&&(t.textContent="Generating with AI..."),n&&n.classList.add("spinning")}function wt(){if(!d||!d.mounted)return;let e=d.panel.querySelector(".generation-status");e&&(e.style.display="none")}function Ba(e,t,n,s){if(!d||!d.mounted)return;let a=k(d.panel);S(a);let o=document.createElement("div");o.className="ncodes-error-state";let r=document.createElement("div");r.className="ncodes-error-icon",r.textContent="\u26A0";let i=document.createElement("div");i.className="ncodes-error-message",i.textContent=e;let c=document.createElement("div");c.className="ncodes-error-actions";let l=document.createElement("button");l.className="ncodes-error-retry",l.textContent="Try again",l.addEventListener("click",()=>{s&&(s.value=t),X(d.panel),E(n,s),d.isGenerating=!1,Y()});let p=document.createElement("button");p.className="ncodes-error-fallback",p.textContent="Use demo mode",p.addEventListener("click",async()=>{X(d.panel),E(n,s),d.isGenerating=!1,s&&(s.value=t),d.isGenerating=!0,await qt(t,n,s),d.isGenerating=!1}),c.appendChild(l),c.appendChild(p),o.appendChild(r),o.appendChild(i),o.appendChild(c),a.appendChild(o),R(d.panel,t),E(n,s)}async function Xa(){if(!d||!d.mounted)return;let e=d.panel.querySelector(".generation-status"),t=d.panel.querySelector(".status-text");if(!(!e||!t)){e.style.display="block";for(let n=0;n<B.length;n++){t.textContent=B[n];let s=n===B.length-1?300:400+Math.random()*300;await Wa(s)}}}function M(){if(!d||!d.mounted)return;let e=St();za(d.panel,e)}function Ya(){!d||!d.mounted||Ct(d.panel,d.trigger)}function Ja(){!d||!d.mounted||P(d.panel,d.trigger)}function zt(){d&&(document.removeEventListener("keydown",$t),document.removeEventListener("click",Tt),d.host&&d.host.parentNode&&d.host.parentNode.removeChild(d.host),d=null)}function Wa(e){return new Promise(t=>setTimeout(t,e))}It.exports={init:Oa,open:Ya,close:Ja,destroy:zt}});return Ka();})();
if(typeof module!=="undefined")module.exports=NCodes;
//# sourceMappingURL=ncodes-widget.js.map
