#!/usr/bin/env python3
"""
generate_tourist_safety_dataset.py
Reproducibly generates a SYNTHETIC tourist-safety dataset for Kolkata, India.

Outputs (written to the output directory, default = script folder):
  tourist_safety_dataset.csv       20 columns, exact order from the project spec
  dataset_data_dictionary.csv      per-column provenance (official / synthetic / mixed)
  location_reference.csv           location_id -> name, coordinates, synthetic parameters
  facilities_reference.csv         police / hospital reference points used for distances
  validation_report.txt            automated checks + quick Random Forest sanity check

Usage:
  python generate_tourist_safety_dataset.py [--out DIR] [--rows 20000] [--seed 42]
                                            [--facilities my_osm_export.csv]

--facilities lets you replace the approximate facility list with a verified OpenStreetMap /
official-directory export. Required columns: facility_type ('police'|'hospital'), name,
latitude, longitude.

IMPORTANT: nearly every value is synthetic. See dataset_data_dictionary.csv for provenance.
"""
import argparse
import os
import numpy as np
import pandas as pd

# ----------------------------------------------------------------------------------------
# Calibration tables
# ----------------------------------------------------------------------------------------
# Monthly normals, Kolkata (Alipore, WMO 42807). Temperature (deg C) and precipitation (mm):
# Tokyo Climate Center (JMA) republication of normals, 1991-2020 style station normals.
MEAN_TEMP = np.array([19.9, 23.8, 28.2, 30.6, 31.2, 30.6, 29.5, 29.4, 29.4, 28.3, 25.1, 21.1])
PRECIP_MM = np.array([11.9, 23.8, 37.6, 55.5, 129.4, 279.1, 387.8, 369.9, 319.2, 177.1, 34.8, 6.0])
# Relative humidity (%) at 17:30 IST, Alipore normals (IMD, as tabulated on Wikipedia).
RH_1730 = np.array([62, 55, 51, 61, 68, 77, 82, 83, 82, 76, 68, 65], dtype=float)
# ASSUMED (not official) diurnal half-range of temperature by month (deg C).
DIURNAL_AMP = np.array([6.0, 6.2, 6.0, 5.5, 4.8, 3.8, 3.0, 3.0, 3.2, 4.0, 5.2, 6.0])
# Approximate sunrise/sunset (decimal IST hours); spot-checked against IMD Dum Dum city pages
# for 10 Oct 2024, 22 Oct 2024, 28 Dec 2025 and 14 Feb 2026. Approximation, not an IMD table.
SUNRISE = np.array([6.30, 6.15, 5.75, 5.35, 5.05, 5.00, 5.10, 5.25, 5.35, 5.55, 5.85, 6.15])
SUNSET = np.array([17.20, 17.45, 17.65, 17.80, 17.95, 18.10, 18.10, 17.95, 17.60, 17.15, 16.90, 16.90])
# ASSUMED weather-state probabilities (shaped by the rainfall normals above).
P_CLOUD = np.array([.12, .14, .18, .25, .28, .40, .45, .45, .42, .28, .15, .12])
P_STORM = np.array([.004, .006, .012, .045, .050, .025, .020, .020, .022, .012, .006, .004])

# Durga Puja crowd windows (approximate dates, assumption) -> evening crowd uplift.
PUJA_WINDOWS = [("2024-10-09", "2024-10-13"), ("2025-09-28", "2025-10-02")]

# location_type codes
ATTR, MARKET, TRANSPORT, RELIGIOUS, PARK, COMMERCIAL, RESID = range(7)

# ----------------------------------------------------------------------------------------
# Observation locations.  Coordinates are APPROXIMATE landmark centroids (from general
# knowledge, NOT downloaded/verified in the build session).  Parameters after `poor_light`
# are SYNTHETIC analyst assumptions, not official statistics.
# (id, name, lat, lon, type, popularity, crime_index, incident_lambda, poor_light_prob,
#  crowd_profile, dwell_multiplier)
# ----------------------------------------------------------------------------------------
LOCATIONS = [
    (1, "Park Street", 22.5534, 88.3524, COMMERCIAL, .95, .42, 2.4, .05, "evening_attr", 1.2),
    (2, "Victoria Memorial", 22.5448, 88.3426, ATTR, 1.00, .28, 1.0, .12, "day_attr", 2.0),
    (3, "New Market", 22.5603, 88.3512, MARKET, .95, .55, 3.3, .08, "market", 1.0),
    (4, "Esplanade", 22.5647, 88.3518, TRANSPORT, .85, .52, 2.9, .10, "transport", .8),
    (5, "Howrah Bridge (Kolkata side)", 22.5851, 88.3468, ATTR, .80, .50, 2.4, .12, "transport", .4),
    (6, "Howrah Railway Station", 22.5839, 88.3426, TRANSPORT, 1.00, .62, 3.8, .12, "transport", .6),
    (7, "Prinsep Ghat", 22.5557, 88.3326, PARK, .60, .40, 1.5, .28, "park", 1.2),
    (8, "Eco Park", 22.6030, 88.4610, PARK, .70, .22, .6, .35, "park", 2.5),
    (9, "Salt Lake Stadium area", 22.5697, 88.4097, PARK, .50, .18, .5, .15, "park", .8),
    (10, "Indian Museum", 22.5578, 88.3515, ATTR, .75, .30, 1.2, .08, "day_attr", 1.6),
    (11, "Dakshineswar Kali Temple", 22.6551, 88.3577, RELIGIOUS, .95, .38, 1.7, .20, "religious", 1.3),
    (12, "Kalighat Temple", 22.5200, 88.3426, RELIGIOUS, .95, .50, 2.5, .18, "religious", 1.1),
    (13, "College Street", 22.5755, 88.3640, MARKET, .80, .44, 2.0, .10, "market", .8),
    (14, "Maidan (Brigade Parade Ground)", 22.5600, 88.3450, PARK, .80, .35, 1.4, .45, "park", 1.0),
    (15, "St. Paul's Cathedral", 22.5446, 88.3470, RELIGIOUS, .50, .20, .6, .10, "day_attr", .9),
    (16, "Science City", 22.5398, 88.3965, ATTR, .70, .15, .5, .10, "day_attr", 2.2),
    (17, "Birla Planetarium", 22.5453, 88.3504, ATTR, .45, .22, .6, .08, "day_attr", 1.0),
    (18, "Rabindra Sarobar", 22.5115, 88.3570, PARK, .60, .28, 1.0, .40, "park", 1.3),
    (19, "Sealdah Station", 22.5676, 88.3702, TRANSPORT, 1.00, .65, 4.0, .14, "transport", .6),
    (20, "Belur Math", 22.6325, 88.3560, RELIGIOUS, .65, .15, .5, .15, "religious", 1.4),
    (21, "Marble Palace", 22.5831, 88.3613, ATTR, .30, .30, .8, .18, "day_attr", 1.0),
    (22, "Jorasanko Thakur Bari", 22.5838, 88.3588, ATTR, .45, .32, 1.0, .15, "day_attr", 1.4),
    (23, "Burrabazar", 22.5810, 88.3590, MARKET, .90, .58, 3.5, .22, "market", .9),
    (24, "Gariahat Market", 22.5172, 88.3665, MARKET, .80, .42, 2.0, .09, "market", .9),
    (25, "BBD Bagh (Dalhousie)", 22.5726, 88.3508, COMMERCIAL, .60, .38, 1.6, .06, "commercial", .6),
    (26, "Shyambazar Five-Point Crossing", 22.6010, 88.3737, COMMERCIAL, .55, .45, 1.8, .15, "commercial", .6),
    (27, "Kolkata Airport (NSCBI)", 22.6547, 88.4467, TRANSPORT, .75, .20, .9, .04, "transport", .6),
    (28, "Eden Gardens", 22.5646, 88.3433, ATTR, .60, .30, 1.0, .30, "day_attr", 1.2),
    (29, "Alipore Zoological Garden", 22.5382, 88.3333, ATTR, .65, .18, .5, .12, "day_attr", 2.0),
    (30, "Nakhoda Masjid", 22.5808, 88.3606, RELIGIOUS, .40, .45, 1.7, .20, "religious", .8),
    (31, "City Centre Salt Lake", 22.5865, 88.4100, MARKET, .80, .15, .6, .03, "market", 1.2),
    (32, "Ballygunge (residential)", 22.5300, 88.3650, RESID, .25, .20, .6, .15, "resid", 1.0),
    (33, "Tollygunge (residential)", 22.4950, 88.3470, RESID, .20, .30, 1.1, .28, "resid", 1.0),
    (34, "Behala (residential)", 22.4980, 88.3170, RESID, .15, .32, 1.2, .38, "resid", 1.0),
    (35, "New Town Action Area I", 22.5770, 88.4770, COMMERCIAL, .35, .15, .5, .30, "commercial", .8),
]

# ----------------------------------------------------------------------------------------
# Emergency facility reference points.  APPROXIMATE coordinates entered from general
# knowledge (typically good to ~0.3-1 km); NOT verified against OpenStreetMap or an official
# directory (no network access in the build session).  Replace via --facilities for real use.
# Peripheral areas (Dakshineswar, Belur, Airport, New Town) are thinly covered, so their
# distances are probably OVERSTATED.
# ----------------------------------------------------------------------------------------
FACILITIES = [
    # facility_type, name, lat, lon, confidence
    ("police", "Lalbazar (Kolkata Police HQ)", 22.5726, 88.3512, "medium"),
    ("police", "Hare Street PS", 22.5690, 88.3465, "medium"),
    ("police", "New Market PS", 22.5600, 88.3500, "medium"),
    ("police", "Park Street PS", 22.5520, 88.3590, "medium"),
    ("police", "Bhowanipore PS", 22.5320, 88.3470, "medium"),
    ("police", "Kalighat PS", 22.5215, 88.3455, "medium"),
    ("police", "Alipore PS", 22.5330, 88.3305, "medium"),
    ("police", "Ballygunge PS", 22.5290, 88.3660, "medium"),
    ("police", "Gariahat PS", 22.5190, 88.3640, "medium"),
    ("police", "Tollygunge PS", 22.4960, 88.3480, "medium"),
    ("police", "Jorasanko PS", 22.5835, 88.3595, "medium"),
    ("police", "Burrabazar PS", 22.5800, 88.3560, "medium"),
    ("police", "Amherst Street PS", 22.5750, 88.3660, "medium"),
    ("police", "Entally PS", 22.5630, 88.3770, "medium"),
    ("police", "Howrah PS", 22.5855, 88.3380, "medium"),
    ("police", "Howrah GRP", 22.5830, 88.3420, "low"),
    ("police", "Golabari PS", 22.5870, 88.3300, "low"),
    ("police", "Bidhannagar South PS", 22.5800, 88.4130, "low"),
    ("police", "Bidhannagar East PS", 22.5890, 88.4180, "low"),
    ("police", "Baranagar PS", 22.6440, 88.3680, "low"),
    ("police", "Eco Park PS", 22.6000, 88.4650, "low"),
    ("police", "Airport PS", 22.6540, 88.4460, "low"),
    ("hospital", "SSKM (PG) Hospital", 22.5395, 88.3430, "medium"),
    ("hospital", "Medical College Kolkata", 22.5745, 88.3640, "medium"),
    ("hospital", "NRS Medical College", 22.5650, 88.3735, "medium"),
    ("hospital", "R. G. Kar Medical College", 22.6050, 88.3745, "medium"),
    ("hospital", "Calcutta National Medical College", 22.5430, 88.3720, "low"),
    ("hospital", "Howrah District Hospital", 22.5878, 88.3226, "low"),
    ("hospital", "Apollo Gleneagles", 22.5738, 88.4012, "medium"),
    ("hospital", "AMRI Salt Lake", 22.5800, 88.4075, "low"),
    ("hospital", "Woodlands Hospital", 22.5337, 88.3300, "medium"),
    ("hospital", "B. M. Birla Heart Research Centre", 22.5360, 88.3275, "low"),
    ("hospital", "AMRI Dhakuria", 22.5105, 88.3635, "medium"),
    ("hospital", "Belle Vue Clinic", 22.5405, 88.3505, "medium"),
    ("hospital", "Fortis Anandapur", 22.5125, 88.4000, "low"),
    ("hospital", "Ramakrishna Mission Seva Pratishthan", 22.5230, 88.3470, "low"),
    ("hospital", "Narayana Multispeciality Rajarhat", 22.5865, 88.4740, "low"),
]


# ----------------------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------------------
def bump(h, c, w):
    d = np.abs(h - c)
    d = np.minimum(d, 24 - d)
    return np.exp(-0.5 * (d / w) ** 2)


def hour_profile(name, h):
    """Relative activity (0..1) by hour for a crowd profile. Expected pattern, not a rule."""
    h = np.asarray(h, dtype=float)
    if name == "day_attr":
        core = bump(h, 13, 3.0) * np.where((h >= 18) | (h < 8), 0.3, 1.0)
        return 0.03 + 0.97 * core
    if name == "evening_attr":
        return 0.05 + 0.95 * np.maximum(bump(h, 20.5, 2.3), 0.35 * bump(h, 13, 3))
    if name == "market":
        core = np.maximum(bump(h, 13, 3), bump(h, 18, 2.2)) * np.where((h >= 22) | (h < 9), 0.08, 1.0)
        return 0.02 + 0.98 * core
    if name == "transport":
        return 0.25 + 0.75 * np.maximum.reduce([bump(h, 9, 2), bump(h, 18, 2.5), 0.5 * bump(h, 13, 4)])
    if name == "religious":
        return 0.08 + 0.92 * np.maximum.reduce([bump(h, 7.5, 2.2), 0.9 * bump(h, 18.5, 2.2), 0.4 * bump(h, 12, 3)])
    if name == "park":
        return 0.04 + 0.96 * np.maximum(bump(h, 6.5, 1.5), bump(h, 17.5, 2))
    if name == "commercial":
        return 0.03 + 0.97 * bump(h, 13, 3.8) * np.where((h >= 9) & (h <= 19), 1.0, 0.15)
    if name == "resid":
        return 0.10 + 0.90 * np.maximum(0.7 * bump(h, 8, 1.8), bump(h, 20, 2.5))
    raise ValueError(name)


WEEKEND_MULT = {"day_attr": 1.35, "evening_attr": 1.40, "market": 1.25, "transport": 0.85,
                "religious": 1.30, "park": 1.45, "commercial": 0.55, "resid": 1.15}
PEAK_DENSITY = {ATTR: 55, MARKET: 110, TRANSPORT: 130, RELIGIOUS: 75, PARK: 40, COMMERCIAL: 50, RESID: 14}
BASE_SPEED = {ATTR: 3.0, MARKET: 2.4, TRANSPORT: 4.2, RELIGIOUS: 2.6, PARK: 3.4, COMMERCIAL: 3.6, RESID: 3.8}
DWELL_MEDIAN = {ATTR: 55, MARKET: 40, TRANSPORT: 15, RELIGIOUS: 35, PARK: 45, COMMERCIAL: 20, RESID: 8}
WX_CROWD = {0: 1.0, 1: 0.95, 2: 0.75, 3: 0.50}
WX_CROWD_TRANSPORT = {0: 1.0, 1: 0.97, 2: 0.88, 3: 0.75}


def haversine_km(lat1, lon1, lat2, lon2):
    r = 6371.0088
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dphi = p2 - p1
    dl = np.radians(lon2) - np.radians(lon1)
    a = np.sin(dphi / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dl / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))


def nearest_km(lat, lon, fac):
    d = haversine_km(lat[:, None], lon[:, None], fac["latitude"].values[None, :], fac["longitude"].values[None, :])
    return d.min(axis=1)


# ----------------------------------------------------------------------------------------
# Generation
# ----------------------------------------------------------------------------------------
def generate(n_rows, seed, fac_df):
    rng = np.random.default_rng(seed)
    weights = np.array([l[5] ** 0.8 for l in LOCATIONS])
    counts = np.floor(weights / weights.sum() * n_rows).astype(int)
    counts[np.argmax(weights)] += n_rows - counts.sum()

    start = np.datetime64("2024-01-01")  # a Monday
    puja_days = set()
    for a, b in PUJA_WINDOWS:
        for d in pd.date_range(a, b):
            puja_days.add(np.datetime64(d.date()))

    frames = []
    for loc, cnt in zip(LOCATIONS, counts):
        (lid, name, lat0, lon0, ltype, pop, crime_idx, lam, poor_p, prof, dwell_mult) = loc
        # Hour sampling: all 24 hours represented, busier hours more likely.
        hw = 0.4 + 1.2 * hour_profile(prof, np.arange(24))
        hour = rng.choice(24, size=cnt, p=hw / hw.sum())
        offs = rng.integers(0, 731, size=cnt)               # 2024-01-01 .. 2025-12-31 (internal only)
        dates = start + offs
        dow = (offs % 7).astype(int)
        month = (dates.astype("datetime64[M]").astype(int) % 12) + 1
        mi = month - 1
        weekend = (dow >= 5).astype(int)
        is_puja = np.array([d in puja_days for d in dates])

        # ---- weather (synthetic, calibrated to Alipore monthly normals) ----
        ps = P_STORM[mi] * np.where((month == 4) | (month == 5), np.where((hour >= 14) & (hour <= 21), 2.3, 0.35), 1.0)
        pr = 0.012 + 0.00048 * PRECIP_MM[mi]
        pc = P_CLOUD[mi]
        u = rng.random(cnt)
        wx = np.where(u < ps, 3, np.where(u < ps + pr, 2, np.where(u < ps + pr + pc, 1, 0)))
        rain = np.where(wx == 2, np.clip(rng.gamma(1.3, 2.4, cnt), 0.2, 25),
                        np.where(wx == 3, np.clip(rng.gamma(2.2, 7.0, cnt), 4, 60), 0.0))
        temp = (MEAN_TEMP[mi] + DIURNAL_AMP[mi] * np.cos(2 * np.pi * (hour - 14.5) / 24)
                + np.select([wx == 1, wx == 2, wx == 3], [-0.8, -2.0, -3.5], 0.0) + rng.normal(0, 1.2, cnt))
        temp = np.clip(temp, 8, 44)
        ref = np.cos(2 * np.pi * (17.5 - 5) / 24)
        hum = (RH_1730[mi] + 8 * (np.cos(2 * np.pi * (hour - 5) / 24) - ref)
               + np.select([wx == 1, wx == 2, wx == 3], [3, 6, 5], 0) + rng.normal(0, 4, cnt))
        hum = np.clip(hum, 25, 100)

        # ---- lighting (day/night from approximate sunrise/sunset; poor lighting is location-specific) ----
        daylight = (SUNRISE[mi] <= hour + 0.5) & (hour + 0.5 < SUNSET[mi])
        p_poor = poor_p + np.where(wx == 3, 0.08, 0) + np.where((ltype == PARK) & ((hour >= 22) | (hour <= 4)), 0.12, 0)
        p_poor = np.clip(p_poor, 0.02, 0.70)
        light = np.where(daylight, 0, np.where(rng.random(cnt) < p_poor, 2, 1))

        # ---- crowd density (people / 100 m^2) ----
        wxmap = WX_CROWD_TRANSPORT if ltype == TRANSPORT else WX_CROWD
        wxf = np.vectorize(wxmap.get)(wx).astype(float)
        wk = np.where(weekend == 1, WEEKEND_MULT[prof], 1.0)
        fest = np.where(is_puja & (hour >= 15) & (hour <= 23) & (ltype in (ATTR, MARKET, COMMERCIAL)), 1.5, 1.0)
        heat = np.where((temp > 37) & (hour >= 11) & (hour <= 16) & (ltype in (ATTR, PARK)), 0.85, 1.0)
        crowd = (PEAK_DENSITY[ltype] * pop * hour_profile(prof, hour) * wk * wxf * fest * heat
                 * rng.lognormal(0, 0.25, cnt))
        crowd = np.clip(crowd, 0.3, 300.0)

        # ---- stationarity, speed, dwell ----
        p_stat = 0.08 + (0.12 if ltype in (ATTR, RELIGIOUS, PARK) else 0.0)
        stationary = rng.random(cnt) < p_stat
        speed = BASE_SPEED[ltype] * (0.35 + 0.65 / (1 + crowd / 70.0)) * rng.lognormal(0, 0.25, cnt)
        speed = np.where(stationary, 0.0, np.clip(speed, 0.2, 6.5))
        dwell = DWELL_MEDIAN[ltype] * dwell_mult * np.where(stationary, 1.3, 1.0) * rng.lognormal(0, 0.55, cnt)
        dwell = np.clip(np.rint(dwell), 1, 300).astype(int)

        # ---- historical context (computed from the PAST only; see README) ----
        # crime_rate: location-level relative index + rolling-window estimation noise
        crime = np.clip(crime_idx + rng.normal(0, 0.03, cnt), 0.0, 1.0)
        # incident_count: prior 28 days, 500 m radius, same 6-hour daypart (negative binomial, r=3)
        daypart = np.select([hour < 6, hour < 12, hour < 18], [0.7, 0.9, 1.1], 1.3)
        mu = lam * daypart * (1 + 0.5 * pop) / 1.25
        inc = rng.poisson(mu * rng.gamma(3.0, 1 / 3.0, cnt))

        # ---- observation coordinates: ~70 m Gaussian scatter around the landmark ----
        dlat = np.clip(rng.normal(0, 70, cnt), -200, 200) / 111_320.0
        dlon = np.clip(rng.normal(0, 70, cnt), -200, 200) / (111_320.0 * np.cos(np.radians(lat0)))

        frames.append(pd.DataFrame({
            "location_id": lid, "latitude": lat0 + dlat, "longitude": lon0 + dlon,
            "hour": hour, "day_of_week": dow, "is_weekend": weekend,
            "crowd_density": crowd, "crime_rate": crime, "incident_count": inc,
            "weather_condition": wx, "temperature": temp, "rainfall": rain, "humidity": hum,
            "tourist_speed": speed, "dwell_time": dwell, "lighting_condition": light,
            "location_type": ltype,
        }))
    df = pd.concat(frames, ignore_index=True)

    # ---- infrastructure distances (straight-line haversine to nearest reference facility) ----
    lat = df["latitude"].values
    lon = df["longitude"].values
    df["police_distance"] = nearest_km(lat, lon, fac_df[fac_df.facility_type == "police"])
    df["hospital_distance"] = nearest_km(lat, lon, fac_df[fac_df.facility_type == "hospital"])

    # ---- risk label: transparent latent score + unobserved noise, then quantile cut ----
    h = df["hour"].values
    night_t = np.select([h <= 4, h == 5, h <= 17, h <= 20, h <= 23], [0.90, 0.35, 0.0, 0.25, 0.65], 0.0)
    crowd = df["crowd_density"].values
    isolation = np.clip((8 - crowd) / 8, 0, 1) * night_t
    protect = np.clip((crowd - 15) / 60, 0, 1) * night_t
    overcrowd = np.clip((crowd - 110) / 100, 0, 1) * (1 - night_t)
    dark = (df["lighting_condition"].values == 2).astype(float)
    art = (df["lighting_condition"].values == 1).astype(float)
    wx = df["weather_condition"].values
    rain_f = (wx == 2).astype(float)
    storm_f = (wx == 3).astype(float)
    stationary = (df["tourist_speed"].values < 0.3).astype(float)
    long_dwell = (df["dwell_time"].values > 120).astype(float)
    heat = (df["temperature"].values >= 37).astype(float)

    z = (2.4 * (df["crime_rate"].values - 0.35)                       # historical crime index
         + 0.30 * np.minimum(df["incident_count"].values, 8)          # historical incidents
         + 1.00 * night_t                                              # time of day
         + 0.90 * dark + 0.15 * art                                    # lighting
         + 1.60 * isolation - 0.90 * protect + 0.45 * overcrowd        # crowd (U-shaped effect)
         + 0.45 * np.minimum(df["police_distance"].values, 4.0).clip(1.0, None) - 0.45  # police access beyond 1 km
         + 0.12 * np.minimum(df["hospital_distance"].values, 6.0).clip(2.0, None) - 0.24  # hospital access beyond 2 km
         + 0.25 * rain_f + 0.55 * storm_f + 0.25 * (rain_f + storm_f) * night_t  # weather (+ night interaction)
         + 0.20 * heat                                                 # heat stress
         + 0.50 * isolation * dark                                     # isolated AND dark
         + 0.35 * stationary * isolation + 0.15 * long_dwell * isolation
         )
    rng = np.random.default_rng(seed + 1)
    z = z + rng.normal(0, 0.55, len(df))                               # unobserved local factors
    t_low, t_high = np.quantile(z, [0.45, 0.80])                       # targets: ~45 / 35 / 20 %
    df["risk_level"] = np.where(z < t_low, 0, np.where(z < t_high, 1, 2)).astype(int)

    # ---- rounding / column order ----
    df["latitude"] = df["latitude"].round(6)
    df["longitude"] = df["longitude"].round(6)
    for c, d in [("crowd_density", 2), ("crime_rate", 3), ("police_distance", 3), ("hospital_distance", 3),
                 ("temperature", 1), ("rainfall", 1), ("humidity", 1), ("tourist_speed", 2)]:
        df[c] = df[c].round(d)
    cols = ["location_id", "latitude", "longitude", "hour", "day_of_week", "is_weekend", "crowd_density",
            "crime_rate", "incident_count", "police_distance", "hospital_distance", "weather_condition",
            "temperature", "rainfall", "humidity", "tourist_speed", "dwell_time", "lighting_condition",
            "location_type", "risk_level"]
    df = df[cols].drop_duplicates().reset_index(drop=True)
    return df, (t_low, t_high)


# ----------------------------------------------------------------------------------------
# Documentation tables
# ----------------------------------------------------------------------------------------
URL_TCC = "https://ds.data.jma.go.jp/gmd/tcc/tcc/products/climate/normal/parts/NrmMonth_e.php?stn=42807"
URL_WIKI = "https://en.wikipedia.org/wiki/Climate_of_Kolkata"
URL_IMD_CITY = "https://city.imd.gov.in/citywx/city_weather.php?id=42809"
URL_NCRB = "https://ncrb.gov.in/"
URL_PTI = "https://www.theweek.in/wire-updates/national/2025/10/04/cal35-wb-kolkata-crime.html"
URL_MOT = "https://tourism.gov.in/sites/default/files/2020-08/Brief-Write%20up.pdf"
URL_MOT_NOSPOT = "https://www.tourism.gov.in/sites/default/files/2020-04/SQ%20246%20for%2017032020.pdf"
NONE = "N/A (no verified source URL)"

WX_CAL = ("Monthly mean temperature and precipitation normals for Kolkata (Alipore, WMO 42807) as republished by "
          "JMA Tokyo Climate Center from India Meteorological Department data; I could not open the original IMD "
          "table in the build session.")


def data_dictionary():
    S = "Synthetic"
    rows = [
        ("location_id", "Identifier of the observation site (see location_reference.csv)", "Integer", "id",
         "Project-assigned identifier", NONE, S, "Sequential IDs 1-35 assigned to the chosen landmarks."),
        ("latitude", "Latitude of the observation (WGS84)", "Float", "degrees",
         "Approximate landmark centroid (analyst knowledge, unverified) + synthetic scatter", NONE, "Mixed",
         "Landmark coordinates are approximations typed in without a verified download; each observation adds "
         "clipped Gaussian scatter (sd 70 m, max 200 m)."),
        ("longitude", "Longitude of the observation (WGS84)", "Float", "degrees",
         "Approximate landmark centroid (analyst knowledge, unverified) + synthetic scatter", NONE, "Mixed",
         "Same as latitude."),
        ("hour", "Hour of day", "Integer", "hour (0-23)", "Synthetic sampling", NONE, S,
         "Sampled per location with weights 0.4 + 1.2*activity profile, so all 24 hours appear but busy hours are more common."),
        ("day_of_week", "0=Monday ... 6=Sunday", "Integer", "code", "Calendar arithmetic on a synthetic date", NONE, S,
         "Internal date drawn uniformly from 2024-01-01..2025-12-31 (date itself is not exported); weekday computed from it."),
        ("is_weekend", "1 if Saturday/Sunday else 0", "Integer", "flag", "Derived from day_of_week", NONE, S,
         "day_of_week >= 5."),
        ("crowd_density", "Estimated people per 100 square metres", "Float", "people/100 m2",
         "None official (context: Ministry of Tourism publishes state-level visit counts only)",
         f"{URL_MOT} | {URL_MOT_NOSPOT}", S,
         "Peak density by location type x location popularity x hourly profile x weekend multiplier x weather factor x "
         "Durga Puja evening uplift x log-normal noise, clipped 0.3-300. Ministry of Tourism states it keeps no spot-wise "
         "visit data, so no official crowd figures were used."),
        ("crime_rate", "Normalized historical crime-risk indicator (0-1), relative among the 35 locations", "Float", "index 0-1",
         "Analyst-assigned relative index; sanity-checked against NCRB city-level context only",
         f"{URL_NCRB} | {URL_PTI}", S,
         "Fixed per-location index (assumption) plus N(0, 0.03) window-estimation noise, clipped to 0-1. NOT an official "
         "statistic. Official anchor is only city-level: NCRB Crime in India 2023 (as reported by PTI) puts Kolkata at 83.9 "
         "cognisable crimes per lakh population vs a 19-metro average of 828; no location-level NCRB data exists."),
        ("incident_count", "Incidents in the 28 days BEFORE the observation, within 500 m, same 6-hour daypart", "Integer", "count",
         "Synthetic (simulated history)", f"{URL_NCRB} | {URL_PTI}", S,
         "Negative binomial (Poisson with Gamma(3, 1/3) mixing) with mean = location lambda x daypart factor x (1+0.5*popularity)/1.25. "
         "Depends on location and daypart only, never on current or future conditions. Absolute levels are NOT calibrated to a "
         "verifiable location-level source."),
        ("police_distance", "Straight-line distance to nearest police facility in reference list", "Float", "km",
         "Computed from approximate facility coordinates (unverified)", NONE, "Mixed",
         "Haversine distance from the scattered observation point to the nearest of 22 police points in facilities_reference.csv. "
         "Facility coordinates were entered from general knowledge, not downloaded from OSM or an official directory."),
        ("hospital_distance", "Straight-line distance to nearest hospital in reference list", "Float", "km",
         "Computed from approximate facility coordinates (unverified)", NONE, "Mixed",
         "Haversine distance to the nearest of 15 hospitals in facilities_reference.csv (approximate coordinates)."),
        ("weather_condition", "0=Clear, 1=Cloudy, 2=Rain, 3=Storm", "Integer", "code",
         "Synthetic, seasonally calibrated to IMD normals", f"{URL_TCC} | {URL_WIKI}", S,
         "Per-hour state sampled with month-specific probabilities: rain probability = 0.012 + 0.00048 x monthly normal precipitation; "
         "storm probability elevated in Apr-May afternoons/evenings; cloud probability assumed by season. Not IMD observations."),
        ("temperature", "Air temperature", "Float", "deg C", "Synthetic, calibrated to IMD monthly mean temperature",
         f"{URL_TCC}", S,
         "Monthly mean (" + WX_CAL + ") + assumed diurnal cosine (peak 14:30) + weather offset + N(0, 1.2); clipped 8-44."),
        ("rainfall", "Rainfall during the observation hour", "Float", "mm", "Synthetic, calibrated to IMD monthly precipitation normals",
         f"{URL_TCC}", S,
         "0 for clear/cloudy; Gamma(1.3, 2.4) clipped 0.2-25 for rain; Gamma(2.2, 7.0) clipped 4-60 for storm."),
        ("humidity", "Relative humidity", "Float", "percent", "Synthetic, calibrated to IMD 17:30 IST monthly RH normals",
         f"{URL_WIKI}", S,
         "Monthly 17:30 RH normal (IMD, as tabulated on Wikipedia) + assumed diurnal cosine (+/-8) + weather offset + N(0, 4); clipped 25-100."),
        ("tourist_speed", "Tourist movement speed", "Float", "km/h", "Synthetic", NONE, S,
         "Location-type walking base speed x (0.35 + 0.65/(1+crowd/70)) x log-normal noise, clipped 0.2-6.5; ~8-20% of rows are stationary (0.0)."),
        ("dwell_time", "Time spent at the location so far", "Integer", "minutes", "Synthetic", NONE, S,
         "Log-normal (sigma 0.55) around a location-type median x per-location multiplier; clipped 1-300."),
        ("lighting_condition", "0=Daylight, 1=Artificial lighting, 2=Poor lighting", "Integer", "code",
         "Synthetic; day/night boundary from approximate sunrise/sunset", f"{URL_IMD_CITY}", S,
         "Daylight if approximate monthly sunrise <= hour+0.5 < sunset (spot-checked against four IMD city pages). At night, poor lighting "
         "with a location-specific probability (+ small storm and late-night park adjustments); never assigned to every night row."),
        ("location_type", "0 Attraction, 1 Market/shopping, 2 Transport hub, 3 Religious, 4 Park/recreation, 5 Commercial, 6 Residential",
         "Integer", "code", "Analyst classification", NONE, S, "Manually assigned per landmark."),
        ("risk_level", "TARGET: 0 Low, 1 Medium, 2 High", "Integer", "class", "Synthetic rule-based label", NONE, S,
         "Latent score from crime index, incidents, night period, lighting, U-shaped crowd effect, police/hospital distance, weather, heat, "
         "isolation interactions, plus N(0, 0.55) unobserved noise; cut at the 45th and 80th percentiles (~45/35/20%). Documented in README."),
    ]
    return pd.DataFrame(rows, columns=["column_name", "description", "data_type", "unit", "data_source", "source_url",
                                       "data_status", "synthetic_generation_method"])


# ----------------------------------------------------------------------------------------
# Validation
# ----------------------------------------------------------------------------------------
def validate(df, thresholds, ddict):
    L = []
    add = L.append
    add("VALIDATION REPORT")
    add("=================")
    add(f"Total rows: {len(df)}")
    add(f"Total columns: {df.shape[1]}")
    add(f"Unique locations: {df.location_id.nunique()}")
    add(f"Missing values: {int(df.isna().sum().sum())}")
    add(f"Duplicate rows: {int(df.duplicated().sum())}")
    stat = ddict.data_status.value_counts().to_dict()
    add(f"Field provenance (of 20 columns): {stat}")
    add("Official fields used as-is: 0 | Derived-from-official fields: 0 | "
        "Mixed (approximate real geography): 4 (latitude, longitude, police_distance, hospital_distance) | Synthetic: 16")
    add("(Official statistics were used only as calibration/context for crime_rate, incident_count, weather and lighting.)")
    add("")
    add("Risk-level distribution (%):")
    add(df.risk_level.value_counts(normalize=True).sort_index().mul(100).round(2).to_string())
    add(f"Risk-score thresholds (latent units): low<{thresholds[0]:.3f}, medium<{thresholds[1]:.3f}, else high")
    add("")
    add("Weather distribution (%):")
    add(df.weather_condition.value_counts(normalize=True).sort_index().mul(100).round(2).to_string())
    add("Rows per hour (min/max): %d / %d" % (df.hour.value_counts().min(), df.hour.value_counts().max()))
    vc = df.location_id.value_counts()
    add("Rows per location (min/median/max): %d / %d / %d" % (vc.min(), vc.median(), vc.max()))
    add("")
    checks = {
        "lat in [22.4, 22.7]": df.latitude.between(22.4, 22.7).all(),
        "lon in [88.2, 88.6]": df.longitude.between(88.2, 88.6).all(),
        "hour 0-23": df.hour.between(0, 23).all(),
        "day_of_week 0-6": df.day_of_week.between(0, 6).all(),
        "is_weekend consistent with day_of_week": ((df.day_of_week >= 5).astype(int) == df.is_weekend).all(),
        "crowd_density 0.3-300": df.crowd_density.between(0.3, 300).all(),
        "crime_rate 0-1": df.crime_rate.between(0, 1).all(),
        "incident_count >= 0": (df.incident_count >= 0).all(),
        "distances > 0": ((df.police_distance > 0) & (df.hospital_distance > 0)).all(),
        "weather_condition in 0-3": df.weather_condition.isin([0, 1, 2, 3]).all(),
        "temperature 8-44": df.temperature.between(8, 44).all(),
        "rainfall >= 0 and 0 unless rain/storm": ((df.rainfall >= 0) & ((df.rainfall > 0) == df.weather_condition.isin([2, 3]))).all(),
        "humidity 0-100": df.humidity.between(0, 100).all(),
        "tourist_speed 0-6.5": df.tourist_speed.between(0, 6.5).all(),
        "dwell_time 1-300": df.dwell_time.between(1, 300).all(),
        "lighting in 0-2": df.lighting_condition.isin([0, 1, 2]).all(),
        "location_type in 0-6": df.location_type.isin(range(7)).all(),
        "risk_level in 0-2, all classes present": set(df.risk_level.unique()) == {0, 1, 2},
        "poor/artificial lighting never in daylight rows (hours 10-15)": (df[df.hour.between(10, 15)].lighting_condition == 0).all(),
        "no daylight code at hours 0-3 or 22-23": (df[df.hour.isin([0, 1, 2, 3, 22, 23])].lighting_condition != 0).all(),
    }
    for k, v in checks.items():
        add(f"[{'PASS' if v else 'FAIL'}] {k}")
    add("")
    feats = [c for c in df.columns if c != "risk_level"]
    corr = df[feats].corrwith(df.risk_level).abs().sort_values(ascending=False)
    add("Max |corr| of any single feature with target: %s = %.3f (no single-feature leakage)" % (corr.index[0], corr.iloc[0]))
    late = df[df.hour >= 22].risk_level.value_counts(normalize=True).sort_index().mul(100).round(1).to_dict()
    add("Risk mix for hour>=22 rows (%%): %s  (late night is NOT automatically high risk)" % late)
    add("Share of high-risk rows by lighting code (%%): %s" %
        df.groupby("lighting_condition").risk_level.apply(lambda s: round(100 * (s == 2).mean(), 1)).to_dict())
    add("")
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import GroupKFold, cross_val_predict, train_test_split
        from sklearn.metrics import accuracy_score, f1_score
        X, y, g = df[feats], df.risk_level, df.location_id
        Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        rf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1).fit(Xtr, ytr)
        p = rf.predict(Xte)
        add("Random Forest sanity check (random 80/20 split): accuracy=%.3f macro-F1=%.3f" %
            (accuracy_score(yte, p), f1_score(yte, p, average="macro")))
        pg = cross_val_predict(RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1), X, y,
                               groups=g, cv=GroupKFold(5))
        add("Random Forest, 5-fold GroupKFold by location_id: accuracy=%.3f macro-F1=%.3f" %
            (accuracy_score(y, pg), f1_score(y, pg, average="macro")))
        imp = pd.Series(rf.feature_importances_, index=feats).sort_values(ascending=False).round(3)
        add("Top feature importances:\n" + imp.head(8).to_string())
        add("Note: scores measure how well a model recovers MY synthetic labelling rule, not real-world safety.")
    except Exception as e:  # sklearn missing
        add(f"scikit-learn check skipped: {e}")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.dirname(os.path.abspath(__file__)))
    ap.add_argument("--rows", type=int, default=20000)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--facilities", default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    if a.facilities:
        fac = pd.read_csv(a.facilities)
    else:
        fac = pd.DataFrame(FACILITIES, columns=["facility_type", "name", "latitude", "longitude", "confidence"])
        fac.insert(0, "facility_id", range(1, len(fac) + 1))
        fac["coordinate_source"] = "Approximate, entered from general knowledge; NOT verified against OSM/official directory"
    fac.to_csv(os.path.join(a.out, "facilities_reference.csv"), index=False, encoding="utf-8")

    df, thr = generate(a.rows, a.seed, fac)
    df.to_csv(os.path.join(a.out, "tourist_safety_dataset.csv"), index=False, encoding="utf-8")

    lr = pd.DataFrame(LOCATIONS, columns=["location_id", "location_name", "latitude", "longitude", "location_type",
                                         "synthetic_popularity", "synthetic_crime_index", "synthetic_incident_lambda",
                                         "synthetic_poor_light_prob", "synthetic_crowd_profile", "synthetic_dwell_multiplier"])
    lr.insert(5, "coordinate_quality", "Approximate landmark centroid (unverified)")
    lr.to_csv(os.path.join(a.out, "location_reference.csv"), index=False, encoding="utf-8")

    dd = data_dictionary()
    dd.to_csv(os.path.join(a.out, "dataset_data_dictionary.csv"), index=False, encoding="utf-8")

    rep = validate(df, thr, dd)
    with open(os.path.join(a.out, "validation_report.txt"), "w", encoding="utf-8") as f:
        f.write(rep + "\n")
    print(rep)


if __name__ == "__main__":
    main()
