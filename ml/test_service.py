#!/usr/bin/env python3
"""
Unit Test Suite for Tourist Safety FastAPI ML Service
Directly tests Pydantic validation, endpoint handlers, inference, and error cases.
"""

import sys
from pathlib import Path
from pydantic import ValidationError

# Ensure ml module directory is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from service import (
    app,
    load_model_and_metadata,
    health,
    get_metadata,
    predict,
    predict_batch,
    PredictionRequest,
    BatchPredictionRequest
)

def run_tests():
    print("=" * 60)
    print("RUNNING FASTAPI SERVICE TEST SUITE")
    print("=" * 60)
    
    # 1. Initialize
    load_model_and_metadata()
    
    # 2. Test GET /health
    health_res = health()
    assert health_res["status"] == "healthy"
    assert health_res["model_loaded"] is True
    assert health_res["model_version"] == "1.0.0"
    print(f"[PASS] health(): status='healthy', version={health_res['model_version']}")
    
    # 3. Test GET /metadata
    meta_res = get_metadata()
    assert "input_features" in meta_res
    assert len(meta_res["input_features"]) == 18
    assert "evaluation" in meta_res
    print(f"[PASS] get_metadata(): successfully retrieved {len(meta_res['input_features'])} features and metrics.")
    
    # 4. Test POST /predict (Low Risk)
    req_low = PredictionRequest(
        latitude=22.5448,
        longitude=88.3426,
        hour=14,
        day_of_week=6,
        is_weekend=1,
        crowd_density=65.0,
        crime_rate=0.28,
        incident_count=0,
        police_distance=0.8,
        hospital_distance=1.2,
        weather_condition=0,
        temperature=28.0,
        rainfall=0.0,
        humidity=60.0,
        tourist_speed=2.5,
        dwell_time=45,
        lighting_condition=0,
        location_type=0
    )
    res_low = predict(req_low)
    assert res_low.risk_level in [0, 1, 2]
    assert res_low.risk_label == "Low"
    assert res_low.confidence > 0.5
    assert len(res_low.factors_summary) > 0
    print(f"[PASS] predict(Low Risk): Label={res_low.risk_label}, Level={res_low.risk_level}, Confidence={res_low.confidence*100:.1f}%")
    print(f"       Factors: {res_low.factors_summary}")
    
    # 5. Test POST /predict (High Risk Edge Case)
    req_high = PredictionRequest(
        latitude=22.5690,
        longitude=88.3580,
        hour=2,
        day_of_week=4,
        is_weekend=0,
        crowd_density=1.5,
        crime_rate=0.65,
        incident_count=5,
        police_distance=2.8,
        hospital_distance=3.4,
        weather_condition=2,
        temperature=24.0,
        rainfall=12.0,
        humidity=90.0,
        tourist_speed=0.0,
        dwell_time=95,
        lighting_condition=2,
        location_type=5
    )
    res_high = predict(req_high)
    assert res_high.risk_level == 2
    assert res_high.risk_label == "High"
    print(f"[PASS] predict(High Risk): Label={res_high.risk_label}, Level={res_high.risk_level}, Confidence={res_high.confidence*100:.1f}%")
    print(f"       Factors: {res_high.factors_summary}")
    
    # 6. Test Input Validation Rejection: Missing Required Field
    missing_passed = False
    try:
        PredictionRequest(
            latitude=22.5448,
            longitude=88.3426,
            day_of_week=6,
            is_weekend=1,
            crime_rate=0.28,
            incident_count=0,
            police_distance=0.8,
            hospital_distance=1.2,
            weather_condition=0,
            temperature=28.0,
            rainfall=0.0,
            humidity=60.0,
            tourist_speed=2.5,
            dwell_time=45,
            lighting_condition=0,
            location_type=0
        )
    except ValidationError as e:
        missing_passed = True
        print(f"[PASS] Schema correctly caught missing required field: {e.error_count()} validation error(s).")
    assert missing_passed, "Expected ValidationError on missing required fields."
    
    # 7. Test Input Validation Rejection: Out of range field (hour=99, latitude=150)
    range_passed = False
    try:
        PredictionRequest(
            latitude=150.0,
            longitude=88.3426,
            hour=99,
            day_of_week=6,
            is_weekend=1,
            crowd_density=65.0,
            crime_rate=0.28,
            incident_count=0,
            police_distance=0.8,
            hospital_distance=1.2,
            weather_condition=0,
            temperature=28.0,
            rainfall=0.0,
            humidity=60.0,
            tourist_speed=2.5,
            dwell_time=45,
            lighting_condition=0,
            location_type=0
        )
    except ValidationError as e:
        range_passed = True
        print(f"[PASS] Schema correctly caught out-of-range field: {e.error_count()} validation error(s).")
    assert range_passed, "Expected ValidationError on out-of-range fields."
    
    # 8. Test POST /predict-batch
    batch_req = BatchPredictionRequest(observations=[req_low, req_high])
    batch_res = predict_batch(batch_req)
    assert batch_res.total_evaluated == 2
    assert len(batch_res.predictions) == 2
    print(f"[PASS] predict_batch(): Evaluated {batch_res.total_evaluated} observations successfully.")
    
    print("\n" + "=" * 60)
    print("ALL 8 API & INFERENCE TEST SUITES PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
