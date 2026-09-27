# Smart Tourist Safety Monitoring & Incident Response System
> **Explore freely. Stay protected intelligently.**

A high-fidelity Smart City / GovTech prototype demonstrating an intelligent tourist safety platform that detects environmental risks, provides predictive alerts, ensures privacy-first cryptographic verification, and connects tourists with emergency responders and municipal command centers in real time.

---

## 1. Executive Summary & Core Paradigm

The **Smart Tourist Safety Monitoring & Incident Response System** bridges the gap between tourist mobility freedom and municipal emergency readiness. Designed for Smart City platforms and GovTech showcases (e.g. Smart India Hackathon), it operates on a unified five-stage lifecycle:

```
Detect ➔ Predict ➔ Alert ➔ Respond ➔ Protect
```

### Two Connected Experiences, One Reactive State:
1. **Tourist Mobile Companion (Mobile-First):**
   * Real-time dynamic safety score circular gauge (0–100) with 5-factor weighting.
   * Autonomous 180m invisible safety bubble.
   * Zero-Knowledge (ZK) Digital Tourist ID with on-chain cryptographic attestations.
   * One-touch 6-step automated SOS emergency protocol.
   * Full offline capability (cached vector maps, safety zones, emergency guide).
   * Transparent 3-tier privacy model (Normal / Caution / Emergency).

2. **Municipal Emergency Operations Center (EOC - Desktop-First):**
   * Live tactical GIS map with 6 toggleable layers (Safety, Crowd, Incidents, Geofences, Responders, Tourists).
   * Computer-Aided Dispatch (CAD) engine with dynamic responder ETA calculations.
   * Vision AI crowd density monitoring with one-click mass diversion advisories.
   * Real-time multi-modal external telemetry feeds (Weather, Air Quality, Traffic, Metro, Emergency 112, Social Signals).
   * Immutable cryptographic CAD audit log.
   * Interactive system architecture inspector.

---

## 2. Comprehensive Route Directory (25 Operational Routes)

### 📱 Tourist Routes
| Route | Description |
| :--- | :--- |
| `/tourist` | Tourist dashboard: Circular safety gauge, environmental conditions, AI advisory summary, quick actions. |
| `/tourist/map` | Fullscreen mobile safety map with 180m safety bubble, geofences, and safety corridors. |
| `/tourist/alerts` | Filterable alert center (Critical, Safety, Weather, Crowd, System) categorized by time. |
| `/tourist/digital-id` | Zero-Knowledge verified Tourist ID with QR code, Merkle proof, and privacy comparison. |
| `/tourist/offline` | Complete offline safety companion with 42 MB asset download simulator and cached guide. |
| `/tourist/incident` | Semantic AI-assisted incident reporting form with real-time severity classification. |
| `/tourist/profile` | Privacy settings, emergency contacts, medical token, and behavioral risk breakdown. |
| `/tourist/privacy` | Comprehensive GovTech privacy architecture, data flow diagrams, and retention rules. |

### 🏢 Safety Authority (EOC) Routes
| Route | Description |
| :--- | :--- |
| `/authority` | Command Center Overview: 6 live delta KPI metrics, live incident feed, and mini-map. |
| `/authority/map` | Fullscreen multi-layer tactical operations map with inspector drawer and filter controls. |
| `/authority/incidents` | Comprehensive incident management table with priority filtering and status actions. |
| `/authority/tourists` | Privacy-preserving anonymized tourist safety roster with risk level monitoring. |
| `/authority/response` | Emergency response dispatch console with automated CAD recommendations. |
| `/authority/analytics` | Recharts analytics: 24h risk patterns, incident category breakdown, dispatch times. |
| `/authority/crowd` | Vision AI crowd density analytics (Zones A, B, C, D) with mass diversion broadcast tools. |
| `/authority/geofences` | Dynamic geofence manager with live security status and perimeter creation modal. |
| `/authority/verification`| Blockchain Digital ID attestation registry and zero-knowledge proof validator. |
| `/authority/insights` | Predictive risk forecasting, crime pattern analysis, and tactical resource positioning. |
| `/authority/data-intelligence` | Real-time multi-modal telemetry feeds (OpenMeteo, CPCB AQI, TomTom, Police 112). |
| `/authority/audit` | Immutable CAD operational audit trail with cryptographic hashes and export tool. |
| `/authority/architecture` | Interactive GovTech multi-tier system architecture diagram with component inspector. |

### 🌐 Global & Presentation Routes
| Route | Description |
| :--- | :--- |
| `/` | High-fidelity GovTech portal landing page with role picker and system stats. |
| `/architecture` | Public architectural blueprint and GovTech system specification. |
| `/privacy` | Global citizen privacy charter and zero-knowledge data retention policy. |
| `/demo` | Dedicated Presenter Control Center with 15-step automated simulator and on-demand triggers. |

---

## 3. Technology Stack & Key Libraries

* **Framework:** Next.js 14 (App Router), React 18, TypeScript (Strict Mode)
* **Styling & Design System:** Tailwind CSS, Custom GovTech palette (Deep Navy `#070b19`, Tactical Slate `#0f172a`, Cyan accents `#06b6d4`, Semantic Alert states)
* **GIS & Mapping:** Leaflet 1.9.4, React-Leaflet, CartoDB Voyager raster tiles
* **Data Visualization:** Recharts (Area, Bar, Pie, Responsive Containers)
* **State Management:** Zustand (reactive, single-source-of-truth synchronized state store)
* **Icons:** Lucide React
* **Cryptography & Privacy:** Simulators for zk-SNARK Groth16 verification, Merkle tree root validation, SHA-256 CAD audit trails.

---

## 4. End-to-End 15-Step Automated Demonstration

The built-in demo engine allows presenters to showcase the entire ecosystem with zero manual setup. Click **▶ RUN SAFETY INCIDENT DEMO** on any page, or visit `/demo` for the presenter console.

```
Step 1:  Tourist Alex Johnson approaches Bowbazar construction corridor.
Step 2:  Geofence warning alert appears on tourist's mobile device.
Step 3:  Safety score dynamically decreases from 84 to 72.
Step 4:  AI computes and recommends safer green bypass route.
Step 5:  Simulated distress/incident occurs in unlit sector.
Step 6:  Tourist triggers one-touch SOS emergency assistance.
Step 7:  Digital ID (ST-IND-2026-004281) cryptographically validated on Gov-Polygon.
Step 8:  High-frequency GPS stream unlocked specifically for emergency responders.
Step 9:  AI classifies emergency as Priority P1 (99% confidence).
Step 10: Nearest unit (Police Unit P-17, 1.4 km, ETA 3 min) identified by CAD.
Step 11: Authority Command Center flashes critical incident banner.
Step 12: Unit P-17 dispatched and placed en route.
Step 13: Tourist mobile view displays live responder telemetry & ETA countdown.
Step 14: Incident resolved on scene; tourist safely escorted to hotel.
Step 15: Post-incident analysis & automated CAD audit record committed to ledger.
```

### Presenter Features at `/demo`:
* **Playback Controls:** Play, Pause, Step Forward, Step Back, Reset, Speed Adjustment (1x, 2x, 5x).
* **On-Demand Scenario Triggers:**
  * 🚨 Trigger Tourist SOS
  * ⚠️ Trigger Geofence Breach
  * 👥 Trigger Crowd Surge (Park Street)
  * 🌧️ Trigger Severe Weather Advisory
  * 📉 Degrade Tourist Safety Score
  * 🛡️ Restore Normal State
* **Metrics Completion Summary:** Response time (4m 18s), AI confidence (94%), Cryptographic verification status (ZK-VALID).

---

## 5. Privacy & Cryptographic Architecture

To adhere to global data protection laws (GDPR, India DPDP Act 2023), this platform implements strict **Privacy-by-Design**:

```
┌─────────────────────────────────────────────────────────────┐
│                    OFF-CHAIN (LOCAL DEVICE)                 │
│  • Full Name, Passport / Aadhaar Number, Phone, Email       │
│  • Raw Historical GPS Trajectory (Stored locally in SQLite) │
│  • Emergency Medical Notes                                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ ZK-SNARK Proof Generation
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ON-CHAIN (GOV-POLYGON SUBNET)               │
│  • Zero-Knowledge Identity Proof (Groth16 SNARK)            │
│  • Ephemeral Validity Hash                                  │
│  • Emergency Public Key                                     │
│  • Tamper-Proof Merkle Root                                 │
└─────────────────────────────────────────────────────────────┘
```

* **Normal Mode:** Only the aggregate safety score (e.g. 82/100) and coarse geographic cell are transmitted.
* **Risk Mode:** When entering high-risk geofences, local edge alerts trigger without notifying central authorities.
* **Emergency Mode (SOS):** Unlocks live telemetry solely to the assigned response unit for the duration of the active incident.

---

## 6. How to Run Locally

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run Next.js development server
npm run dev

# 3. Open application in your browser
http://localhost:3000
```

### Production Build & Route Verification
```bash
# Run full production build
npm run build

# Run automated 25-route HTTP status check
node test-routes.js
```

---

## 7. Disclaimer
*All data shown, including tourist identities, responder locations, incident coordinates, and telemetry feeds, is simulated for demonstration and academic prototype purposes.*
