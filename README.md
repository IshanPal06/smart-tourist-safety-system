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

## 6. Machine Learning Tourist Safety Risk Prediction Engine

The platform integrates a CPU-optimized machine learning tabular classifier that predicts real-time tourist safety risk (`Low`, `Medium`, or `High`) from multidimensional telemetry.

### 6.1 Dataset & Data Provenance
* **Dataset Location:** `ml/data/tourist_safety_dataset.csv` (20,000 observations x 20 columns)
* **Data Dictionary:** `ml/data/dataset_data_dictionary.csv`
* **Reference Files:** `location_reference.csv` (35 landmark centroids), `facilities_reference.csv` (police stations & hospitals)
* **Dataset Generator:** `ml/data/generate_tourist_safety_dataset.py` (fixed seed 42)
* **Data Status:**
  * **16 Synthetic Columns:** Heuristically generated based on realistic urban mobility patterns and environmental models.
  * **4 Mixed Columns:** `latitude`, `longitude`, `police_distance`, `hospital_distance` (calibrated to approximate Kolkata landmark coordinates with Gaussian scatter).
  * **Calibrations:** Monthly temperature and precipitation normals calibrated against India Meteorological Department (IMD) Alipore station normals; relative crime weighting contextualized by NCRB *Crime in India 2023* city aggregate statistics.
  * **Identifier:** `location_id` (1–35) is strictly an observation group identifier and is **excluded from predictive feature sets** to prevent location-memorization leakage.

### 6.2 Verified Feature Schema (18 Features)
| Feature Name | Data Type | Range / Values | Description |
| :--- | :--- | :--- | :--- |
| `latitude` | Float | 22.40 – 22.70 | Latitude coordinate (degrees WGS84) |
| `longitude` | Float | 88.20 – 88.60 | Longitude coordinate (degrees WGS84) |
| `hour` | Integer | 0 – 23 | Hour of day (IST) |
| `day_of_week` | Integer | 0 – 6 | 0=Monday, 1=Tuesday ... 6=Sunday |
| `is_weekend` | Integer | 0 or 1 | 1 if Saturday or Sunday, else 0 |
| `crowd_density` | Float | 0.3 – 300.0 | Estimated people per 100 m² |
| `crime_rate` | Float | 0.0 – 1.0 | Normalized historical crime-risk indicator |
| `incident_count`| Integer | 0 – 15+ | Incidents in prior 28 days within 500m window |
| `police_distance`| Float | > 0.0 km | Distance to nearest police station |
| `hospital_distance`| Float | > 0.0 km | Distance to nearest hospital |
| `weather_condition`| Integer | 0, 1, 2, 3 | 0=Clear, 1=Cloudy, 2=Rain, 3=Storm |
| `temperature` | Float | 8.0 – 44.0 °C | Ambient air temperature |
| `rainfall` | Float | 0.0 – 60.0 mm | Precipitation in observation hour |
| `humidity` | Float | 25 – 100 % | Relative humidity |
| `tourist_speed` | Float | 0.0 – 6.5 km/h | Movement speed (0.0 = stationary) |
| `dwell_time` | Integer | 1 – 300 mins | Time spent at location |
| `lighting_condition`| Integer | 0, 1, 2 | 0=Daylight, 1=Artificial, 2=Poor lighting |
| `location_type` | Integer | 0 – 6 | 0 Attraction, 1 Market, 2 Transport, 3 Religious, 4 Park, 5 Commercial, 6 Residential |

**Target Column (`risk_level`):**
* `0` = Low Risk (45.0% of dataset, 9,000 samples)
* `1` = Medium Risk (35.0% of dataset, 7,000 samples)
* `2` = High Risk (20.0% of dataset, 4,000 samples)

### 6.3 Model Choice & Architecture
* **Algorithm:** `RandomForestClassifier` (`n_estimators=200`, `max_depth=16`, `min_samples_split=5`, `min_samples_leaf=2`, `class_weight='balanced'`, `random_state=42`)
* **Pipeline:** Built inside a `scikit-learn Pipeline` with a `ColumnTransformer` and `SimpleImputer(strategy='median')` to guarantee identical preprocessing during inference and complete resilience to missing values.
* **Hardware Mode:** Pure CPU execution. Does not require GPU, CUDA, or heavyweight deep learning runtimes.

### 6.4 Evaluation Metrics & Honest Findings
* **Spatial Cross-Validation (5-Fold `GroupKFold` grouped by `location_id`):**
  * **Accuracy:** `73.92%`
  * **Macro F1 Score:** `0.7331`
  * **Weighted F1 Score:** `0.7380`
* **Stratified 80/20 Holdout Test:**
  * **Accuracy:** `75.02%`
  * **Macro F1 Score:** `0.7476`
* **Per-Class Classification Report (GroupKFold):**
  * *Low Risk:* Precision: 0.80, Recall: 0.83, F1: 0.82
  * *Medium Risk:* Precision: 0.64, Recall: 0.61, F1: 0.62
  * *High Risk:* Precision: 0.76, Recall: 0.75, F1: 0.76
* **Confusion Matrix (Rows=True, Cols=Predicted):**
  * Low: 7,486 Correct | 1,485 predicted Medium | 29 predicted High
  * Medium: 1,800 predicted Low | 4,294 Correct | 906 predicted High
  * High: 24 predicted Low | 971 predicted Medium | 3,005 Correct
* **Top Predictive Feature Importances:**
  1. `incident_count` (21.8%)
  2. `crime_rate` (10.6%)
  3. `hour` (10.0%)
  4. `lighting_condition` (10.0%)
  5. `crowd_density` (8.8%)
  6. `longitude` / `latitude` (9.8%)
  7. `police_distance` / `hospital_distance` (9.1%)
  8. `dwell_time` / `tourist_speed` (6.7%)

> [!IMPORTANT]
> **Honest Scientific Evaluation Notice:**
> The model target was generated using synthetic heuristic formulas (combining crime index, historical incidents, night period, poor lighting, crowd isolation, distances to emergency services, and Gaussian noise). High evaluation accuracy reflects how effectively the Random Forest recovers these latent rules; it **must not** be presented as empirical proof of real-world physical safety prediction ground truth.

---

## 7. Setup, Training, and Execution Guide (Windows PowerShell)

### 7.1 Prerequisites
* **Node.js:** v18+ or v24 LTS (`node -v`)
* **Python:** 3.10+ or 3.11+ (`python --version`)

### 7.2 Step 1: Install Dependencies
Open PowerShell in the project root (`d:\smart-tourist-safety-system`):

```powershell
# 1. Install Node.js frontend dependencies
npm.cmd install

# 2. Install Python ML requirements
python -m pip install -r ml/requirements.txt
```

### 7.3 Step 2: Train or Retrain the Model
To validate the dataset, run spatial 5-fold cross-validation, and serialize the trained pipeline:

```powershell
python ml/train.py
```
* **Model Artifact:** `ml/models/tourist_safety_model.joblib` (13.4 MB)
* **Metadata & Metrics:** `ml/models/model_metadata.json`

### 7.4 Step 3: Run Model Sanity Tests & Edge Cases
```powershell
python ml/evaluate.py
python ml/test_service.py
```

### 7.5 Step 4: Start the Services

#### Terminal 1 — Python FastAPI ML Microservice:
```powershell
python ml/service.py
```
* Service runs at `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
* Health Check: `http://127.0.0.1:8000/health`

#### Terminal 2 — Next.js Application:
```powershell
npm.cmd run dev
```
* Web application runs at `http://localhost:3000`

### 7.6 Step 5: Run Automated End-to-End Verification
To test the complete stack (Python ML Service + Next.js Server + Prediction API + Frontend routes) in a single automated suite:
```powershell
powershell -ExecutionPolicy Bypass -File test-e2e.ps1
```

---

## 8. Prediction API Specification

### `POST /api/predict` (Next.js Gateway) & `POST http://127.0.0.1:8000/predict` (Python Microservice)

#### Request Body (JSON):
```json
{
  "latitude": 22.5448,
  "longitude": 88.3426,
  "hour": 14,
  "day_of_week": 6,
  "is_weekend": 1,
  "crowd_density": 65.0,
  "crime_rate": 0.28,
  "incident_count": 0,
  "police_distance": 0.8,
  "hospital_distance": 1.2,
  "weather_condition": 0,
  "temperature": 28.0,
  "rainfall": 0.0,
  "humidity": 60.0,
  "tourist_speed": 2.5,
  "dwell_time": 45,
  "lighting_condition": 0,
  "location_type": 0
}
```

#### Response Body (JSON, HTTP 200):
```json
{
  "risk_level": 0,
  "risk_label": "Low",
  "confidence": 0.9101,
  "probabilities": {
    "Low": 0.9101,
    "Medium": 0.0898,
    "High": 0.0001
  },
  "model_version": "1.0.0",
  "factors_summary": [
    "Optimal lighting, standard crowd density, and active police radius"
  ],
  "disclaimer": "Model trained on calibrated synthetic dataset. Probability estimates reflect simulated rule recovery.",
  "service_available": true,
  "evaluated_at": "2026-10-24T18:18:20.123Z",
  "source": "ml_service"
}
```

#### Graceful Offline Degradation (HTTP 503):
If the Python ML microservice is stopped or unreachable, the Next.js API gracefully responds with:
```json
{
  "service_available": false,
  "error": "ML prediction service is unavailable at http://127.0.0.1:8000. Start the ML service using 'python ml/service.py'."
}
```
The frontend catches this and guides the user to start the service rather than crashing or showing a silent fallback.

---

## 9. Deployment Considerations

* **Local Development:** Run `python ml/service.py` in one terminal and `npm run dev` in another.
* **Platform Hosting (e.g. Render / Railway / Vercel):**
  * **Frontend & Next.js API:** Deploy to Vercel or Render Web Service. Configure environment variable `ML_SERVICE_URL` pointing to the Python service.
  * **Python ML Service:** Deploy `ml/` to a Render Web Service or Railway using `uvicorn service:app --host 0.0.0.0 --port $PORT` with `ml/requirements.txt`.
  * **Resource Consumption:** The model artifact is ~13.4 MB and fits comfortably within free/starter tier RAM limits (512 MB).

---

## 10. How to Run Locally (Summary)

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

## 11. Academic Disclaimer
*All data shown, including tourist identities, responder locations, incident coordinates, and telemetry feeds, is simulated for demonstration and academic prototype purposes.*
