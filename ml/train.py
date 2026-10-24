#!/usr/bin/env python3
"""
Tourist Safety ML Model Training Script
Smart Tourist Safety Monitoring & Incident Response System

Trains a CPU-optimized Random Forest Classifier on tourist safety telemetry.
Saves versioned model artifact (.joblib) and comprehensive metadata (.json).
"""

import sys
import os
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, GroupKFold, cross_val_predict
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score
)

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "tourist_safety_dataset.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "tourist_safety_model.joblib"
METADATA_PATH = MODEL_DIR / "model_metadata.json"

# Verified 18 predictive features (excluding location_id and risk_level)
FEATURE_NAMES = [
    "latitude",
    "longitude",
    "hour",
    "day_of_week",
    "is_weekend",
    "crowd_density",
    "crime_rate",
    "incident_count",
    "police_distance",
    "hospital_distance",
    "weather_condition",
    "temperature",
    "rainfall",
    "humidity",
    "tourist_speed",
    "dwell_time",
    "lighting_condition",
    "location_type"
]

TARGET_NAME = "risk_level"
CLASS_MAPPING = {
    0: "Low",
    1: "Medium",
    2: "High"
}


def validate_dataset(df: pd.DataFrame) -> dict:
    """Run data integrity and schema validation checks."""
    print("=" * 60)
    print("1. VALIDATING DATASET")
    print("=" * 60)
    
    n_rows, n_cols = df.shape
    print(f"Dataset shape: {n_rows} rows x {n_cols} columns")
    
    # Check required columns
    missing_cols = [c for c in FEATURE_NAMES + [TARGET_NAME, "location_id"] if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns in CSV: {missing_cols}")
    
    # Check nulls
    null_counts = df.isnull().sum()
    total_nulls = int(null_counts.sum())
    print(f"Total null/missing values: {total_nulls}")
    
    # Check duplicates
    duplicates = int(df.duplicated().sum())
    print(f"Total duplicate rows: {duplicates}")
    
    # Target distribution
    target_counts = df[TARGET_NAME].value_counts().sort_index().to_dict()
    target_pct = (df[TARGET_NAME].value_counts(normalize=True).sort_index() * 100).to_dict()
    
    print("\nTarget Class Distribution:")
    for cls_idx, count in target_counts.items():
        label = CLASS_MAPPING.get(cls_idx, f"Class {cls_idx}")
        pct = target_pct[cls_idx]
        print(f"  Class {cls_idx} ({label}): {count:,} rows ({pct:.1f}%)")
        
    validation_info = {
        "n_rows": n_rows,
        "n_cols": n_cols,
        "total_nulls": total_nulls,
        "duplicates": duplicates,
        "class_distribution_counts": {CLASS_MAPPING[k]: v for k, v in target_counts.items()},
        "class_distribution_pct": {CLASS_MAPPING[k]: round(v, 2) for k, v in target_pct.items()}
    }
    return validation_info


def build_pipeline() -> Pipeline:
    """Build scikit-learn preprocessing and modeling pipeline."""
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", SimpleImputer(strategy="median"), FEATURE_NAMES)
        ],
        remainder="drop"
    )
    
    classifier = RandomForestClassifier(
        n_estimators=200,
        max_depth=16,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    
    return Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])


def evaluate_model(df: pd.DataFrame):
    """Evaluate using GroupKFold (by location_id) and Stratified Holdout."""
    print("\n" + "=" * 60)
    print("2. MODEL EVALUATION & CROSS-VALIDATION")
    print("=" * 60)
    
    X = df[FEATURE_NAMES]
    y = df[TARGET_NAME]
    groups = df["location_id"]
    
    # 1. Spatial GroupKFold evaluation (5 folds across 35 unique locations)
    print("\nRunning 5-Fold GroupKFold Cross-Validation (by location_id)...")
    gkf = GroupKFold(n_splits=5)
    pipeline_cv = build_pipeline()
    y_pred_cv = cross_val_predict(pipeline_cv, X, y, groups=groups, cv=gkf, n_jobs=-1)
    
    acc_gkf = float(accuracy_score(y, y_pred_cv))
    f1_macro_gkf = float(f1_score(y, y_pred_cv, average="macro"))
    f1_weighted_gkf = float(f1_score(y, y_pred_cv, average="weighted"))
    
    print(f"GroupKFold Accuracy:     {acc_gkf:.4f}")
    print(f"GroupKFold Macro F1:     {f1_macro_gkf:.4f}")
    print(f"GroupKFold Weighted F1:  {f1_weighted_gkf:.4f}")
    
    print("\nGroupKFold Classification Report:")
    report_gkf_dict = classification_report(
        y, y_pred_cv,
        target_names=[CLASS_MAPPING[i] for i in sorted(CLASS_MAPPING.keys())],
        output_dict=True
    )
    print(classification_report(
        y, y_pred_cv,
        target_names=[CLASS_MAPPING[i] for i in sorted(CLASS_MAPPING.keys())]
    ))
    
    cm_gkf = confusion_matrix(y, y_pred_cv).tolist()
    print("GroupKFold Confusion Matrix (Rows=True, Cols=Predicted):")
    print(f"  {'':10} Low  Medium  High")
    for i, row in enumerate(cm_gkf):
        label = CLASS_MAPPING[i]
        print(f"  {label:8}: {row[0]:5d} {row[1]:7d} {row[2]:5d}")

    # 2. Stratified 80/20 Holdout evaluation
    print("\nRunning Stratified 80/20 Train-Test Holdout Split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    holdout_pipeline = build_pipeline()
    holdout_pipeline.fit(X_train, y_train)
    y_pred_test = holdout_pipeline.predict(X_test)
    
    acc_holdout = float(accuracy_score(y_test, y_pred_test))
    f1_macro_holdout = float(f1_score(y_test, y_pred_test, average="macro"))
    report_holdout_dict = classification_report(
        y_test, y_pred_test,
        target_names=[CLASS_MAPPING[i] for i in sorted(CLASS_MAPPING.keys())],
        output_dict=True
    )
    cm_holdout = confusion_matrix(y_test, y_pred_test).tolist()
    
    print(f"Holdout Test Accuracy: {acc_holdout:.4f}")
    print(f"Holdout Macro F1:      {f1_macro_holdout:.4f}")
    
    return {
        "group_kfold": {
            "n_splits": 5,
            "group_variable": "location_id",
            "accuracy": round(acc_gkf, 4),
            "macro_f1": round(f1_macro_gkf, 4),
            "weighted_f1": round(f1_weighted_gkf, 4),
            "classification_report": report_gkf_dict,
            "confusion_matrix": cm_gkf
        },
        "holdout_test": {
            "test_size": 0.20,
            "accuracy": round(acc_holdout, 4),
            "macro_f1": round(f1_macro_holdout, 4),
            "classification_report": report_holdout_dict,
            "confusion_matrix": cm_holdout
        }
    }


def train_and_save_final_model(df: pd.DataFrame, eval_metrics: dict, validation_info: dict):
    """Train production model on entire dataset and save versioned artifacts."""
    print("\n" + "=" * 60)
    print("3. TRAINING PRODUCTION MODEL & SAVING ARTIFACTS")
    print("=" * 60)
    
    X = df[FEATURE_NAMES]
    y = df[TARGET_NAME]
    
    pipeline = build_pipeline()
    pipeline.fit(X, y)
    
    # Feature importances
    rf_classifier = pipeline.named_steps["classifier"]
    importances = rf_classifier.feature_importances_
    feat_imp = sorted(
        zip(FEATURE_NAMES, [round(float(v), 4) for v in importances]),
        key=lambda x: x[1],
        reverse=True
    )
    
    print("\nFeature Importances:")
    for feat, imp in feat_imp:
        bar = "#" * int(imp * 100)
        print(f"  {feat:20} {imp:6.4f} | {bar}")
    
    # Ensure model directory exists
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save model artifact
    joblib.dump(pipeline, MODEL_PATH, compress=3)
    file_size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"\nSaved model artifact to: {MODEL_PATH}")
    print(f"Artifact size: {file_size_mb:.2f} MB")
    
    # Save comprehensive metadata
    metadata = {
        "model_name": "tourist_safety_random_forest",
        "model_version": "1.0.0",
        "algorithm": "RandomForestClassifier",
        "framework": "scikit-learn",
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "input_features": FEATURE_NAMES,
        "feature_count": len(FEATURE_NAMES),
        "target_column": TARGET_NAME,
        "class_mapping": CLASS_MAPPING,
        "class_labels": ["Low", "Medium", "High"],
        "hyperparameters": {
            "n_estimators": 200,
            "max_depth": 16,
            "min_samples_split": 5,
            "min_samples_leaf": 2,
            "class_weight": "balanced",
            "random_state": 42
        },
        "dataset_validation": validation_info,
        "evaluation": eval_metrics,
        "feature_importances": dict(feat_imp),
        "provenance_notes": {
            "dataset_type": "Synthetic (calibrated against NCRB city context and IMD Kolkata normals)",
            "leakage_prevention": "location_id excluded from feature set; GroupKFold cross-validation used to test cross-location spatial generalization.",
            "disclaimer": "This model was trained on synthetic data generated via heuristic rules. Evaluation metrics measure how effectively the Random Forest recovers the underlying synthetic latent score rules, and must not be presented as proof of real-world safety ground truth."
        }
    }
    
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {METADATA_PATH}")
    
    return pipeline, metadata


def main():
    if not DATA_PATH.exists():
        print(f"Error: Dataset not found at {DATA_PATH}")
        sys.exit(1)
        
    print(f"Loading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    
    validation_info = validate_dataset(df)
    eval_metrics = evaluate_model(df)
    train_and_save_final_model(df, eval_metrics, validation_info)
    
    print("\n" + "=" * 60)
    print("TRAINING & SERIALIZATION COMPLETE SUCCESSFULLY")
    print("=" * 60)


if __name__ == "__main__":
    main()
