#!/usr/bin/env python3
"""
Tourist Safety ML Prediction Service (FastAPI)
Smart Tourist Safety Monitoring & Incident Response System

Exposes a REST API for real-time tourist safety risk classification.
Loads the serialized Random Forest pipeline at startup.
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("tourist_safety_ml")

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "tourist_safety_model.joblib"
METADATA_PATH = BASE_DIR / "models" / "model_metadata.json"

# Global state
MODEL = None
METADATA = {}
FEATURE_NAMES = []
CLASS_MAPPING = {0: "Low", 1: "Medium", 2: "High"}


def load_model_and_metadata():
    """Load model artifact and metadata into memory."""
    global MODEL, METADATA, FEATURE_NAMES, CLASS_MAPPING
    
    if not MODEL_PATH.exists():
        logger.error(f"Model file not found at {MODEL_PATH}")
        raise FileNotFoundError(f"Model artifact missing: {MODEL_PATH}. Run 'python ml/train.py' first.")
        
    if not METADATA_PATH.exists():
        logger.error(f"Metadata file not found at {METADATA_PATH}")
        raise FileNotFoundError(f"Metadata missing: {METADATA_PATH}.")
        
    logger.info(f"Loading model from {MODEL_PATH}...")
    MODEL = joblib.load(MODEL_PATH)
    
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        METADATA = json.load(f)
        
    FEATURE_NAMES = METADATA.get("input_features", [])
    raw_mapping = METADATA.get("class_mapping", {0: "Low", 1: "Medium", 2: "High"})
    CLASS_MAPPING = {int(k): v for k, v in raw_mapping.items()}
    logger.info(f"Loaded model version {METADATA.get('model_version')} with {len(FEATURE_NAMES)} features.")


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure model is ready
    if MODEL is None:
        load_model_and_metadata()
    yield

# Initialize FastAPI app with modern lifespan
app = FastAPI(
    title="Smart Tourist Safety Risk Prediction API",
    description="ML service providing tabular risk classification (Low, Medium, High) for tourist safety monitoring.",
    version="1.0.0",
    lifespan=lifespan
)

# Load model immediately on module import so it is hot and ready
try:
    load_model_and_metadata()
except Exception as e:
    logger.warning(f"Deferred model loading: {e}")


# ----------------------------------------------------------------------------------------
# Request & Response Schemas
# ----------------------------------------------------------------------------------------
class PredictionRequest(BaseModel):
    """Verified input schema matching the 18 model features."""
    latitude: float = Field(..., description="Latitude coordinate (e.g. 22.4 to 22.7 for Kolkata)")
    longitude: float = Field(..., description="Longitude coordinate (e.g. 88.2 to 88.6 for Kolkata)")
    hour: int = Field(..., ge=0, le=23, description="Hour of day (0-23)")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week: 0=Monday ... 6=Sunday")
    is_weekend: int = Field(..., ge=0, le=1, description="1 if weekend (Sat/Sun), else 0")
    crowd_density: float = Field(..., ge=0.0, description="Estimated people per 100 m² (0.3 to 300)")
    crime_rate: float = Field(..., ge=0.0, le=1.0, description="Normalized crime risk index (0.0 to 1.0)")
    incident_count: int = Field(..., ge=0, description="Prior incidents in area/time window (>=0)")
    police_distance: float = Field(..., ge=0.0, description="Distance to nearest police station in km")
    hospital_distance: float = Field(..., ge=0.0, description="Distance to nearest hospital in km")
    weather_condition: int = Field(..., ge=0, le=3, description="0=Clear, 1=Cloudy, 2=Rain, 3=Storm")
    temperature: float = Field(..., ge=-10.0, le=60.0, description="Ambient air temperature in Celsius")
    rainfall: float = Field(..., ge=0.0, description="Rainfall precipitation in mm")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity percentage (0-100)")
    tourist_speed: float = Field(..., ge=0.0, le=50.0, description="Tourist movement speed in km/h (0=stationary)")
    dwell_time: int = Field(..., ge=0, le=1440, description="Time spent at current location in minutes")
    lighting_condition: int = Field(..., ge=0, le=2, description="0=Daylight, 1=Artificial, 2=Poor lighting")
    location_type: int = Field(..., ge=0, le=6, description="0=Attraction, 1=Market, 2=Transport, 3=Religious, 4=Park, 5=Commercial, 6=Residential")

    @field_validator("latitude")
    @classmethod
    def check_latitude(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def check_longitude(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError("Longitude must be between -180 and 180")
        return v


class BatchPredictionRequest(BaseModel):
    observations: List[PredictionRequest]


class PredictionResponse(BaseModel):
    risk_level: int = Field(..., description="Target risk class: 0=Low, 1=Medium, 2=High")
    risk_label: str = Field(..., description="Risk label name: Low, Medium, or High")
    confidence: float = Field(..., description="Model estimated class probability (0.0 to 1.0)")
    probabilities: Dict[str, float] = Field(..., description="Class probability distribution")
    model_version: str = Field(..., description="Model artifact version")
    factors_summary: List[str] = Field(default_factory=list, description="Key driving factors identified")
    disclaimer: str = Field(
        default="Model trained on calibrated synthetic dataset. Probability estimates reflect simulated rule recovery.",
        description="Dataset and prediction provenance disclaimer"
    )


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]
    total_evaluated: int
    model_version: str


# ----------------------------------------------------------------------------------------
# Inference Helper
# ----------------------------------------------------------------------------------------
def generate_factor_summary(req: PredictionRequest, risk_level: int) -> List[str]:
    factors = []
    if req.incident_count > 3:
        factors.append(f"Elevated historical incidents in sector ({req.incident_count} in past 28d)")
    if req.crime_rate > 0.5:
        factors.append(f"Elevated relative area crime index ({req.crime_rate:.2f})")
    if req.lighting_condition == 2:
        factors.append("Poor ambient illumination in immediate sector")
    elif req.lighting_condition == 1:
        factors.append("Artificial nighttime lighting")
    if req.hour >= 22 or req.hour <= 4:
        factors.append(f"Late night period ({req.hour:02d}:00 IST)")
    if req.crowd_density < 5.0 and (req.hour >= 21 or req.hour <= 5):
        factors.append("Isolated pedestrian density during off-hours")
    elif req.crowd_density > 100.0:
        factors.append("High crowd congestion zone")
    if req.police_distance > 2.0:
        factors.append(f"Police facility distance: {req.police_distance:.1f} km")
    if req.weather_condition in (2, 3):
        factors.append("Adverse weather precipitation / storm active")
    if req.tourist_speed < 0.3 and req.dwell_time > 60:
        factors.append(f"Prolonged stationary dwell time ({req.dwell_time} mins)")
    if not factors:
        factors.append("Optimal lighting, standard crowd density, and active police radius")
    return factors


def run_inference(df: pd.DataFrame) -> List[PredictionResponse]:
    """Execute inference pipeline on DataFrame."""
    if MODEL is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not loaded. Ensure training artifact exists."
        )
        
    df_ordered = df[FEATURE_NAMES]
    predictions = MODEL.predict(df_ordered)
    probabilities = MODEL.predict_proba(df_ordered)
    
    results = []
    for i in range(len(df_ordered)):
        pred_idx = int(predictions[i])
        pred_label = CLASS_MAPPING.get(pred_idx, f"Class_{pred_idx}")
        probs_row = probabilities[i]
        confidence = float(probs_row[pred_idx])
        
        prob_dict = {
            CLASS_MAPPING.get(c, f"Class_{c}"): round(float(p), 4)
            for c, p in enumerate(probs_row)
        }
        
        # Build explanation factors for single observation
        row_dict = df_ordered.iloc[i].to_dict()
        req_obj = PredictionRequest(**row_dict)
        factors = generate_factor_summary(req_obj, pred_idx)
        
        results.append(PredictionResponse(
            risk_level=pred_idx,
            risk_label=pred_label,
            confidence=round(confidence, 4),
            probabilities=prob_dict,
            model_version=METADATA.get("model_version", "1.0.0"),
            factors_summary=factors
        ))
        
    return results


# ----------------------------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------------------------
@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    """Health check endpoint indicating model readiness."""
    is_ready = MODEL is not None
    return {
        "status": "healthy" if is_ready else "degraded",
        "model_loaded": is_ready,
        "model_version": METADATA.get("model_version", "unknown"),
        "algorithm": METADATA.get("algorithm", "RandomForestClassifier"),
        "expected_features_count": len(FEATURE_NAMES),
        "classes": CLASS_MAPPING,
        "hardware_mode": "CPU",
        "dataset_provenance": METADATA.get("provenance_notes", {}).get("dataset_type", "Synthetic")
    }


@app.get("/metadata", status_code=status.HTTP_200_OK)
def get_metadata():
    """Returns detailed training metadata, metrics, and data dictionary notes."""
    if not METADATA:
        return {"error": "Metadata not loaded"}
    return METADATA


@app.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def predict(request: PredictionRequest):
    """
    Predict tourist safety risk level for a single telemetry record.
    Returns predicted risk_level (0=Low, 1=Medium, 2=High), label, confidence, and class probabilities.
    """
    try:
        row_df = pd.DataFrame([request.model_dump()])
        results = run_inference(row_df)
        return results[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inference error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference computation error: {str(e)}"
        )


@app.post("/predict-batch", response_model=BatchPredictionResponse, status_code=status.HTTP_200_OK)
def predict_batch(request: BatchPredictionRequest):
    """Predict tourist safety risk levels for multiple records (e.g. for geofence assessment)."""
    if not request.observations:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty observations list.")
    try:
        data_list = [obs.model_dump() for obs in request.observations]
        df = pd.DataFrame(data_list)
        results = run_inference(df)
        return BatchPredictionResponse(
            predictions=results,
            total_evaluated=len(results),
            model_version=METADATA.get("model_version", "1.0.0")
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch inference error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch inference computation error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", os.environ.get("ML_PORT", 8000)))
    host = os.environ.get("HOST", "127.0.0.1")
    logger.info(f"Starting Tourist Safety ML Service on {host}:{port}...")
    uvicorn.run("service:app", host=host, port=port, reload=False, app_dir=str(BASE_DIR))
