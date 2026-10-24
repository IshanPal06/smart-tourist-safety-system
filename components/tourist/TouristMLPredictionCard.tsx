'use client';

import React, { useState, useEffect } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  BrainCircuit, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Info,
  Server
} from 'lucide-react';
import { MLPredictionResult } from '@/types';

export const TouristMLPredictionCard: React.FC = () => {
  const { 
    tourist, 
    mlPrediction, 
    isMlLoading, 
    mlError, 
    mlServiceStatus, 
    fetchMLRiskPrediction, 
    checkMLStatus 
  } = useSafetyStore();

  const [hasEvaluated, setHasEvaluated] = useState(false);

  useEffect(() => {
    // Initial health check on mount
    checkMLStatus();
  }, [checkMLStatus]);

  const handlePredict = async () => {
    setHasEvaluated(true);
    await fetchMLRiskPrediction();
  };

  const getRiskBadge = (label?: string) => {
    switch (label?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          indicator: 'bg-rose-500',
          text: 'HIGH RISK',
          icon: ShieldAlert,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          indicator: 'bg-amber-400',
          text: 'MEDIUM RISK',
          icon: AlertTriangle,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          indicator: 'bg-emerald-400',
          text: 'LOW RISK',
          icon: ShieldCheck,
        };
    }
  };

  const badge = getRiskBadge(mlPrediction?.risk_label);
  const BadgeIcon = badge.icon;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-navy-900 to-navy-950 p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-navy-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-white">
                ML Safety Risk Predictor
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-800 text-cyan-300 border border-navy-700">
                v1.0 • RF
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Random Forest tabular classifier • 18 verified telemetry features
            </p>
          </div>
        </div>

        {/* Live Service Status Indicator */}
        <div className="flex items-center space-x-1.5 text-[11px]">
          <span 
            className={`h-2 w-2 rounded-full ${
              mlServiceStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 
              mlServiceStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-400'
            }`} 
          />
          <span className="font-mono text-xs text-slate-300 uppercase">
            {mlServiceStatus === 'connected' ? 'ML Online' : 
             mlServiceStatus === 'offline' ? 'Service Offline' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {mlPrediction ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Result Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-navy-950 p-3.5 border border-navy-800">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl border ${badge.bg}`}>
                <BadgeIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Predicted Safety Class</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-black border ${badge.bg}`}>
                    {badge.text}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    ({(mlPrediction.confidence * 100).toFixed(1)}% model confidence)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <div className="flex items-center space-x-1 justify-end">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span className="font-mono">{tourist.currentLocation.name.split(',')[0]}</span>
              </div>
              <div className="flex items-center space-x-1 justify-end">
                <Clock className="h-3 w-3 text-slate-500" />
                <span>{new Date(mlPrediction.evaluated_at || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="space-y-1.5 rounded-xl bg-navy-900/60 p-3 border border-navy-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Class Probability Distribution
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-emerald-950/40 p-2 border border-emerald-900/50">
                <div className="text-[10px] font-bold text-emerald-400">LOW</div>
                <div className="font-mono font-black text-white text-sm">
                  {((mlPrediction.probabilities?.Low || 0) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="rounded-lg bg-amber-950/40 p-2 border border-amber-900/50">
                <div className="text-[10px] font-bold text-amber-400">MEDIUM</div>
                <div className="font-mono font-black text-white text-sm">
                  {((mlPrediction.probabilities?.Medium || 0) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="rounded-lg bg-rose-950/40 p-2 border border-rose-900/50">
                <div className="text-[10px] font-bold text-rose-400">HIGH</div>
                <div className="font-mono font-black text-white text-sm">
                  {((mlPrediction.probabilities?.High || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Key Contributing Factors */}
          {mlPrediction.factors_summary && mlPrediction.factors_summary.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Identified Telemetry Factors
              </span>
              <ul className="space-y-1">
                {mlPrediction.factors_summary.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transparency Disclaimer */}
          <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800 text-[10px] text-slate-400 flex items-start space-x-2">
            <Info className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <p leading-tight>
              <strong>Data Provenance Notice:</strong> {mlPrediction.disclaimer} Confidence reflects the model&apos;s estimated class probability, not a deterministic guarantee of physical hazard.
            </p>
          </div>
        </div>
      ) : mlError ? (
        /* Error or Service Offline State */
        <div className="rounded-xl bg-rose-950/30 p-4 border border-rose-800/40 space-y-2">
          <div className="flex items-center space-x-2 text-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <h4 className="font-bold text-xs">ML Inference Service Unavailable</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mlError}
          </p>
          <div className="rounded bg-navy-950 p-2 border border-navy-800 font-mono text-[11px] text-cyan-300">
            Run: <span className="text-white">python ml/service.py</span> in PowerShell to start the prediction server.
          </div>
        </div>
      ) : (
        /* Un-evaluated Prompt State */
        <div className="rounded-xl bg-navy-950/60 p-4 border border-navy-800/60 text-center space-y-2">
          <Activity className="h-6 w-6 text-cyan-400 mx-auto" />
          <p className="text-xs text-slate-300">
            Evaluate your current GPS location, environmental conditions, and nearby safety telemetry using the CPU-trained Random Forest model.
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-1 flex items-center gap-2">
        <button
          onClick={handlePredict}
          disabled={isMlLoading}
          className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 py-2.5 text-xs font-bold text-white shadow-md transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isMlLoading ? 'animate-spin' : ''}`} />
          <span>{isMlLoading ? 'Evaluating via ML Model...' : hasEvaluated ? 'Re-Evaluate Current Location' : 'Run Real-Time ML Risk Prediction'}</span>
        </button>

        {mlServiceStatus === 'offline' && (
          <button
            onClick={() => checkMLStatus()}
            title="Check connection to ML service"
            className="flex items-center justify-center rounded-xl bg-navy-800 hover:bg-navy-700 p-2.5 text-xs text-slate-300 border border-navy-700 transition"
          >
            <Server className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
