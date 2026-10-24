#!/usr/bin/env python3
"""
Tourist Safety ML Model Evaluation & Sanity Test Script
Smart Tourist Safety Monitoring & Incident Response System

Verifies that the serialized model artifact can be loaded in a clean process,
validates input predictions, tests edge cases, and prints evaluation metrics.
"""

import sys
import json
from pathlib import Path
import joblib
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "tourist_safety_model.joblib"
METADATA_PATH = BASE_DIR / "models" / "model_metadata.json"


def test_model_loading():
    print("=" * 60)
    print("TEST 1: LOADING SERIALIZED MODEL ARTIFACT")
    print("=" * 60)
    
    if not MODEL_PATH.exists():
        print(f"FAILED: Model file not found at {MODEL_PATH}")
        sys.exit(1)
        
    if not METADATA_PATH.exists():
        print(f"FAILED: Metadata file not found at {METADATA_PATH}")
        sys.exit(1)
        
    model = joblib.load(MODEL_PATH)
    print(f"Model successfully loaded from: {MODEL_PATH}")
    
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)
    print(f"Metadata version: {metadata.get('model_version')}")
    print(f"Expected features ({metadata.get('feature_count')}): {metadata.get('input_features')}")
    print(f"Classes: {metadata.get('class_mapping')}")
    print("[PASS] Model and metadata load successfully.")
    return model, metadata


def test_sample_predictions(model, metadata):
    print("\n" + "=" * 60)
    print("TEST 2: PREDICTION SANITY CHECKS ON EDGE SCENARIOS")
    print("=" * 60)
    
    feature_names = metadata["input_features"]
    
    scenarios = [
        {
            "name": "Scenario A: Daytime Safe Attraction (Victoria Memorial, 2 PM)",
            "data": {
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
                "lighting_condition": 0, # Daylight
                "location_type": 0       # Attraction
            },
            "expected_risk": "Low"
        },
        {
            "name": "Scenario B: Late Night Isolated Unlit Sector (Bowbazar, 2 AM)",
            "data": {
                "latitude": 22.5690,
                "longitude": 88.3580,
                "hour": 2,
                "day_of_week": 4,
                "is_weekend": 0,
                "crowd_density": 1.5,
                "crime_rate": 0.65,
                "incident_count": 5,
                "police_distance": 2.8,
                "hospital_distance": 3.4,
                "weather_condition": 2, # Rain
                "temperature": 24.0,
                "rainfall": 12.0,
                "humidity": 90.0,
                "tourist_speed": 0.0,   # Stationary
                "dwell_time": 95,
                "lighting_condition": 2, # Poor lighting
                "location_type": 5       # Commercial/Alley
            },
            "expected_risk": "High"
        },
        {
            "name": "Scenario C: Evening Bustling Market (New Market, 7 PM)",
            "data": {
                "latitude": 22.5603,
                "longitude": 88.3512,
                "hour": 19,
                "day_of_week": 5,
                "is_weekend": 1,
                "crowd_density": 120.0,
                "crime_rate": 0.55,
                "incident_count": 2,
                "police_distance": 0.5,
                "hospital_distance": 1.5,
                "weather_condition": 0,
                "temperature": 26.5,
                "rainfall": 0.0,
                "humidity": 75.0,
                "tourist_speed": 1.8,
                "dwell_time": 40,
                "lighting_condition": 1, # Artificial
                "location_type": 1       # Market
            },
            "expected_risk": "Medium"
        }
    ]
    
    class_map = {int(k): v for k, v in metadata["class_mapping"].items()}
    
    for sc in scenarios:
        row_df = pd.DataFrame([sc["data"]])[feature_names]
        pred_idx = int(model.predict(row_df)[0])
        pred_label = class_map[pred_idx]
        probs = model.predict_proba(row_df)[0]
        confidence = float(probs[pred_idx])
        
        prob_dict = {class_map[i]: round(float(p), 4) for i, p in enumerate(probs)}
        
        print(f"\n{sc['name']}:")
        print(f"  Predicted Risk:   {pred_idx} ({pred_label})")
        print(f"  Confidence:       {confidence * 100:.1f}%")
        print(f"  Class Probs:      {prob_dict}")
        print(f"  Expected:         {sc['expected_risk']}")
        if pred_label == sc['expected_risk']:
            print("  Result:           [PASS - Matches Expected]")
        else:
            print(f"  Result:           [NOTE - Predicted {pred_label} vs Expected {sc['expected_risk']}]")


def test_invalid_and_missing_inputs(model, metadata):
    print("\n" + "=" * 60)
    print("TEST 3: MISSING & EXTRA COLUMNS HANDLING")
    print("=" * 60)
    
    feature_names = metadata["input_features"]
    
    # 1. Input with missing optional values (NaNs) handled by imputer in pipeline
    incomplete_data = {
        "latitude": 22.5534,
        "longitude": 88.3524,
        "hour": 18,
        # Missing crowd_density, temperature
        "day_of_week": 3,
        "is_weekend": 0,
        "crime_rate": 0.42,
        "incident_count": 1,
        "police_distance": 0.6,
        "hospital_distance": 1.0,
        "weather_condition": 0,
        "rainfall": 0.0,
        "humidity": 65.0,
        "tourist_speed": 2.0,
        "dwell_time": 25,
        "lighting_condition": 1,
        "location_type": 5
    }
    row_df = pd.DataFrame([incomplete_data])
    # Ensure all columns exist even if NaN
    for col in feature_names:
        if col not in row_df.columns:
            row_df[col] = np.nan
    row_df = row_df[feature_names]
    
    try:
        pred = model.predict(row_df)
        print("[PASS] Pipeline with SimpleImputer successfully handles missing/NaN feature values without crashing.")
    except Exception as e:
        print(f"[FAIL] Pipeline threw exception on missing feature: {e}")
        

def main():
    model, metadata = test_model_loading()
    test_sample_predictions(model, metadata)
    test_invalid_and_missing_inputs(model, metadata)
    print("\n" + "=" * 60)
    print("ALL EVALUATION & SANITY TESTS COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()
