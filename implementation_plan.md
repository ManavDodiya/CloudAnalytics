# Cloud Analytics Dashboard — Implementation Plan

A premium, interactive web dashboard for **comparative analysis of AI/compute token costs** across five cloud platforms: **AWS, Azure, Kamatera, Alibaba Cloud, and Oracle Cloud**.

---

## Overview

The site will have two main modes:
1. **Comparative Analytics View** — Side-by-side metrics, graphs, and rankings across all 5 platforms (pricing tiers, latency SLAs, uptime history, token throughput, etc.)
2. **Token Cost Estimator** — An interactive calculator where users enter token counts (input/output) and instantly see projected costs across all platforms.

Design philosophy: **Dark-mode-first glassmorphism dashboard** — inspired by the attached reference but reimagined with a space/nebula aesthetic, vibrant accent gradients (violet → cyan), animated charts, and card-based layout.

---

## User Review Required

> [!IMPORTANT]
> **Token pricing data**: Cloud platforms (especially Kamatera) don't publish standardized "token" pricing. I will model this as **LLM API calls hosted on each platform** (e.g., AWS Bedrock, Azure OpenAI, Alibaba Model Studio, Oracle GenAI, Kamatera VM-hosted inference estimate). Please confirm this mapping is correct, or specify if you mean raw VM compute costs per token of throughput.

> [!WARNING]
> **Kamatera** does not offer a managed LLM API — cost will be estimated as "self-hosted model on Kamatera GPU VM" and marked as an approximation. Let me know if you want a different approach.

---

## Tech Stack

| Item | Choice | Reason |
|---|---|---|
| Framework | Vanilla HTML + CSS + JS (Vite) | Fast, no build complexity, matches your Servora prototype stack |
| Charts | **Chart.js** (CDN) | Lightweight, beautiful, supports animated radar/bar/line |
| Animations | **GSAP** (CDN) | Smooth entrance animations, counter roll-ups |
| Fonts | **Inter** + **Space Grotesk** (Google Fonts) | Modern, premium feel |
| Icons | **Lucide Icons** (CDN) | Consistent, lightweight SVG icons |

---

## Pages & Layout Structure

```
index.html          ← Single-page app with section routing
├── #overview       ← Hero + KPI summary cards
├── #compare        ← Full comparison table + bar charts
├── #estimator      ← Token cost calculator
└── #insights       ← Key takeaways / platform rankings
```

### Navigation
- **Fixed top navbar** with logo, section tabs, and a dark/light mode toggle
- **Sticky sidebar** on desktop (>1024px) for quick metric category switching

---

## Section Breakdown

### 1. `#overview` — Hero Dashboard

**Left panel (60%)**
- Animated headline: *"Compare Cloud AI Costs in Real Time"*
- Sub-headline with platform count and metric count
- **5 Platform badges** (colored pills with logos) — click to highlight in charts
- **Quick stats ticker**: average cost per 1M tokens, cheapest platform badge, best uptime

**Right panel (40%)**
- **Animated radar chart** — Normalized scores across: Cost, Uptime, Latency, Support, Scalability
- Auto-rotates highlight per platform every 3s

---

### 2. `#compare` — Full Metrics Comparison

#### 2a. Metric Categories (tabbed filter)
- 💰 **Pricing** (per token, per GPU hour, egress costs)
- ⚡ **Performance** (latency P50/P95, cold start time)
- 🛡️ **Reliability** (SLA uptime %, past incident count)
- 🌐 **Coverage** (region count, edge PoPs)
- 🧩 **Ecosystem** (managed services, certifications)

#### 2b. Comparison Table
- Sticky platform header row with logo + color accent
- Cell-level color coding: 🟢 best → 🔴 worst (normalized per metric)
- Sortable columns
- Expandable rows for sub-metrics

#### 2c. Dual-axis Bar Chart
- Grouped bars per platform, switching metric on tab change
- Animated on first scroll-into-view
- Tooltip shows exact value + % diff from cheapest

#### 2d. Trend Line Chart
- Historical pricing changes (6-month simulated data) per platform
- Toggle which platforms to show

---

### 3. `#estimator` — Token Cost Calculator

**Input panel:**
| Field | Type | Default |
|---|---|---|
| Input Tokens | Number slider + manual | 1,000,000 |
| Output Tokens | Number slider + manual | 500,000 |
| Requests/month | Number | 10,000 |
| Model tier | Dropdown (Economy / Standard / Premium) | Standard |
| Region | Dropdown | US East |

**Output panel (live, animated):**
- **5 cost cards** — one per platform, animated roll-up counter
- Cheapest platform gets a **"Best Value 🏆"** badge
- Progress bar showing relative cost vs cheapest
- **Breakdown table**: Input token cost | Output token cost | API fees | Total
- **"Export as CSV"** button

---

### 4. `#insights` — Key Takeaways

- **Leaderboard cards** — Platform ranked per category with medal icons
- **AI-generated insight blurbs** (static, pre-written, context-aware based on estimator inputs)
- **Animated highlight stat** (e.g., "Azure is 23% cheaper than AWS for premium tier output tokens")
- **Share / Copy Link** button that encodes estimator state in the URL hash

---

## Data Model

All pricing data will be in a `data/pricing.js` module:

```js
export const platforms = [
  {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    color: "#FF9900",
    logo: "aws.svg",
    pricing: {
      economy:  { inputPer1M: 0.50,  outputPer1M: 1.50 },
      standard: { inputPer1M: 1.00,  outputPer1M: 3.00 },
      premium:  { inputPer1M: 3.00,  outputPer1M: 15.00 },
    },
    metrics: {
      uptimeSLA: 99.99,
      latencyP50: 320,  // ms
      regions: 33,
      supportTiers: 4,
    }
  },
  // ...azure, kamatera, alibaba, oracle
]
```

Kamatera will have a `note: "estimated"` flag and a distinct visual indicator.

---

## Visual Design System

### Color Palette
```css
--bg-primary:    #080B14;  /* Deep space navy */
--bg-card:       rgba(255,255,255,0.04);  /* Glass */
--accent-violet: #7C3AED;
--accent-cyan:   #06B6D4;
--accent-grad:   linear-gradient(135deg, #7C3AED, #06B6D4);
--text-primary:  #F1F5F9;
--text-muted:    #64748B;
```

### Platform Accent Colors
| Platform | Color |
|---|---|
| AWS | `#FF9900` |
| Azure | `#0078D4` |
| Kamatera | `#00C896` |
| Alibaba | `#FF6A00` |
| Oracle | `#C74634` |

### Typography
- **Display**: Space Grotesk Bold
- **Body/UI**: Inter Regular/Medium
- **Mono (numbers)**: JetBrains Mono

### Animations
- Page load: staggered card entrance (GSAP `fromTo`, y:40 → y:0, opacity 0→1)
- Chart data update: smooth 600ms transition
- Estimator numbers: animated counter roll-up on value change
- Radar chart: auto-rotation with soft glow on active platform

---

## File Structure

```
d:\Programming\Antigravity\Cloud Analytics\
├── index.html
├── style.css                  ← Design tokens + layout
├── main.js                    ← App init, router, GSAP
├── data/
│   └── pricing.js             ← All platform data
├── components/
│   ├── navbar.js
│   ├── hero.js
│   ├── compareTable.js
│   ├── charts.js              ← Chart.js wrappers
│   ├── estimator.js
│   └── insights.js
├── assets/
│   ├── logos/                 ← Platform SVG logos
│   └── icons/
└── package.json               ← Vite config
```

---

## Proposed Changes

### [NEW] `index.html`
Main shell with meta tags, font imports, CDN scripts (Chart.js, GSAP, Lucide).

### [NEW] `style.css`
Full design system: CSS custom properties, glassmorphism cards, grid layouts, responsive breakpoints, animations.

### [NEW] `data/pricing.js`
Static data module for all 5 platforms — pricing tiers, performance metrics, regional data, historical pricing.

### [NEW] `components/navbar.js`
Sticky navigation with section highlighting on scroll and theme toggle.

### [NEW] `components/hero.js`
Animated hero with radar chart and platform badges.

### [NEW] `components/compareTable.js`
Sortable, filterable comparison table with color-coded cells.

### [NEW] `components/charts.js`
Reusable Chart.js chart factories: radar, bar (grouped), line (trend), doughnut.

### [NEW] `components/estimator.js`
Token calculator — input sliders, live cost computation, animated output cards, CSV export.

### [NEW] `components/insights.js`
Platform leaderboard and dynamic insight blurbs.

### [NEW] `main.js`
App orchestrator — initializes all components, handles scroll-based routing, GSAP entrance animations.

### [NEW] `package.json`
Vite project config.

---

## Verification Plan

### Browser Testing
- Open the site and verify all 4 sections scroll/navigate correctly
- Test estimator with min/max token values (0 to 100M tokens)
- Verify CSV export downloads correctly
- Test all chart tab switches and platform toggles
- Verify platform filter badges update charts

### Responsive Check
- Desktop (1440px): full two-column/sidebar layout
- Tablet (768px): stacked columns, collapsing sidebar
- Mobile (375px): single column, horizontal scroll on table

### Data Accuracy Check
- Cross-reference AWS Bedrock, Azure OpenAI, Alibaba Model Studio, Oracle GenAI pricing against public documentation
- Kamatera approximation clearly labelled
