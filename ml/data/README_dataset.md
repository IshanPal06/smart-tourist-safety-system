# Kolkata Tourist Safety Dataset - read this first

**This dataset is synthetic.** I could not obtain any location-level official data (see below), so 16 of the 20 columns are fully
synthetic and 4 are "mixed" (approximate real geography). Nothing here should be presented as real observations.

## Files
| File | Purpose |
|---|---|
| `tourist_safety_dataset.csv` | 20,000 rows x 20 columns, exact spec order, UTF-8, comma-delimited |
| `dataset_data_dictionary.csv` | Per-column provenance, source URLs, status, generation method |
| `location_reference.csv` | location_id -> name, approximate coordinates, synthetic parameters (not model features) |
| `facilities_reference.csv` | Police/hospital reference points behind the distance columns |
| `validation_report.txt` | Automated checks + Random Forest sanity check |
| `generate_tourist_safety_dataset.py` | Reproduces everything (seed 42) |

## Official sources actually used (verified during this session)
- **NCRB, Crime in India 2023** (city-level only): Kolkata 83.9 cognisable crimes per lakh vs a 828 average across 19 metros. I read this
  via a PTI report (https://www.theweek.in/wire-updates/national/2025/10/04/cal35-wb-kolkata-crime.html), not the NCRB PDF itself. Used only as
  context: Kolkata is a low-crime metro, so incident counts are kept low. Not spread across landmarks as "official".
- **IMD monthly normals, Kolkata (Alipore)**: temperature/precipitation via JMA Tokyo Climate Center
  (https://ds.data.jma.go.jp/gmd/tcc/tcc/products/climate/normal/parts/NrmMonth_e.php?stn=42807); 17:30 relative humidity via Wikipedia's
  table of IMD normals (https://en.wikipedia.org/wiki/Climate_of_Kolkata). Sunrise/sunset spot-checked on IMD Dum Dum city pages.
- **Ministry of Tourism**: state-level visits only (West Bengal 2019: 92.37 m domestic, 1.66 m foreign); the Ministry says it keeps no
  spot-wise data. So crowd_density has no official calibration.

## What I could NOT do
- No Kolkata Police / WB Police location-level incident data was found, so incident_count and crime_rate are synthetic.
- The build sandbox had no internet for downloads, so **no OpenStreetMap or official facility directory was pulled**. Landmark and
  facility coordinates were entered from general knowledge (roughly 0.3-1 km accuracy, some "low" confidence). Peripheral sites
  (Science City, Behala, New Town, Dakshineswar, Belur) have thin facility coverage, so their distances are likely overstated.
  **Replace `facilities_reference.csv` with an OSM/Overpass export and re-run with `--facilities`** before relying on distances.
- No IMD hourly observations were used; weather rows are simulated, not IMD records.

## How synthetic columns are generated (details in the dictionary)
Location x hour x date -> weather (seasonal probabilities from rainfall normals) -> lighting (sunrise/sunset + location-specific poor-light
probability) -> crowd (type peak x popularity x hourly profile x weekend/weather/Puja factors) -> speed and dwell (depend on crowd and type).
History columns (`crime_rate`, `incident_count`) depend only on location and daypart (28-day, 500 m window), so no future information.

## Target construction (`risk_level`)
Latent score = crime index + historical incidents + night period + poor/artificial lighting + U-shaped crowd effect (isolation at night
raises risk, crowds at night protect, extreme daytime crush adds a little) + police/hospital distance beyond thresholds + rain/storm
(+ night interaction) + heat + isolation x dark + stationary/long dwell *only when isolated* + N(0, 0.55) unobserved noise.
Cut at the 45th/80th percentiles -> **45% Low / 35% Medium / 20% High**. Crowded, stationary, transport-hub or rainy alone do not make "High".
Late-night rows are 49% High / 42% Medium / 9% Low - elevated, not deterministic.

## Limitations
- Labels encode my assumptions; model accuracy (~0.73-0.75) measures recovery of that rule, not real safety prediction.
- Crime indices, popularity, poor-lighting probabilities and dwell multipliers per location are analyst assumptions.
- Durga Puja windows (2024-10-09..13, 2025-09-28..10-02) are approximate.
- Use `GroupKFold` on `location_id` to avoid optimistic estimates; do not use `location_id` as a feature in deployment.

## Random Forest quick start
```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.metrics import classification_report
df = pd.read_csv("tourist_safety_dataset.csv")
X, y, g = df.drop(columns=["risk_level", "location_id"]), df["risk_level"], df["location_id"]
rf = RandomForestClassifier(n_estimators=300, class_weight="balanced", random_state=42, n_jobs=-1)
pred = cross_val_predict(rf, X, y, groups=g, cv=GroupKFold(5))
print(classification_report(y, pred, target_names=["Low", "Medium", "High"]))
```
