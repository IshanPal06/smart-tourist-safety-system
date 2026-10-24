'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert,
  TrendingUp, 
  RefreshCw,
  MapPin,
  Clock,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  BarChart3
} from 'lucide-react';
import { MLPredictionResult, MLTelemetryInput } from '@/types';
import { predictTouristRisk } from '@/services/mlService';

export const AuthorityInsights: React.FC = () => {
  // Predefined Kolkata locations for interactive testing
  const sampleLocations = [
    { name: 'Victoria Memorial', lat: 22.5448, lng: 88.3426, crime: 0.28, policeDist: 0.8, hospDist: 1.2, locType: 0 },
    { name: 'Bowbazar Construction Sector', lat: 22.5690, lng: 88.3580, crime: 0.65, policeDist: 2.8, hospDist: 3.4, locType: 5 },
    { name: 'New Market Commercial Hub', lat: 22.5603, lng: 88.3512, crime: 0.55, policeDist: 0.5, hospDist: 1.5, locType: 1 },
    { name: 'Howrah Railway Station', lat: 22.5839, lng: 88.3426, crime: 0.62, policeDist: 0.4, hospDist: 1.1, locType: 2 },
    { name: 'Prinsep Ghat Riverbank', lat: 22.5557, lng: 88.3326, crime: 0.40, policeDist: 1.5, hospDist: 2.2, locType: 4 },
    { name: 'Park Street Entertainment Corridor', lat: 22.5534, lng: 88.3524, crime: 0.42, policeDist: 0.6, hospDist: 1.0, locType: 5 },
  ];

  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
  const [hour, setHour] = useState(22);
  const [crowdDensity, setCrowdDensity] = useState(8.0);
  const [lighting, setLighting] = useState(2); // 0=Daylight, 1=Artificial, 2=Poor
  const [weather, setWeather] = useState(2); // 0=Clear, 1=Cloudy, 2=Rain, 3=Storm
  const [incidentCount, setIncidentCount] = useState(3);
  const [speed, setSpeed] = useState(0.0);
  const [dwellTime, setDwellTime] = useState(60);

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<MLPredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const loc = sampleLocations[selectedLocIndex];

    const telemetry: MLTelemetryInput = {
      latitude: loc.lat,
      longitude: loc.lng,
      hour: Number(hour),
      day_of_week: 5, // Friday
      is_weekend: 1,
      crowd_density: Number(crowdDensity),
      crime_rate: loc.crime,
      incident_count: Number(incidentCount),
      police_distance: loc.policeDist,
      hospital_distance: loc.hospDist,
      weather_condition: Number(weather),
      temperature: weather >= 2 ? 24.0 : 28.5,
      rainfall: weather === 2 ? 10.0 : weather === 3 ? 35.0 : 0.0,
      humidity: weather >= 2 ? 88.0 : 65.0,
      tourist_speed: Number(speed),
      dwell_time: Number(dwellTime),
      lighting_condition: Number(lighting),
      location_type: loc.locType,
    };

    try {
      const res = await predictTouristRisk(telemetry);
      setPrediction(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'ML Prediction Service Unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const featureImportance = [
    { name: 'incident_count', pct: '21.8%', width: 'w-full' },
    { name: 'crime_rate', pct: '10.6%', width: 'w-1/2' },
    { name: 'hour', pct: '10.0%', width: 'w-1/2' },
    { name: 'lighting_condition', pct: '10.0%', width: 'w-1/2' },
    { name: 'crowd_density', pct: '8.8%', width: 'w-2/5' },
    { name: 'longitude / latitude', pct: '9.8%', width: 'w-2/5' },
    { name: 'police / hospital distance', pct: '9.1%', width: 'w-2/5' },
    { name: 'dwell_time / speed', pct: '6.7%', width: 'w-1/3' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            <span>AI Risk Forecasting & Machine Learning Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time inference using trained Random Forest tabular classifier (18 telemetry parameters)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
            Model: RF-v1.0.0 (scikit-learn)
          </span>
        </div>
      </div>

      {/* Grid: Model Specification & Interactive Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Model Architecture & Metrics Card */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-black uppercase text-white">Model Metrics & Specs</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              CPU Optimized
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400 uppercase">GroupKFold Accuracy</span>
              <p className="font-mono text-sm font-bold text-white">73.9%</p>
              <span className="text-[9px] text-slate-500">5-fold by location_id</span>
            </div>
            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400 uppercase">Holdout Test F1</span>
              <p className="font-mono text-sm font-bold text-cyan-400">0.748</p>
              <span className="text-[9px] text-slate-500">Macro F1 score</span>
            </div>
            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400 uppercase">Training Dataset</span>
              <p className="font-mono text-sm font-bold text-white">20,000</p>
              <span className="text-[9px] text-slate-500">Calibrated observations</span>
            </div>
            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400 uppercase">Target Classes</span>
              <p className="font-mono text-sm font-bold text-white">3 Levels</p>
              <span className="text-[9px] text-slate-500">Low (45%), Med (35%), High (20%)</span>
            </div>
          </div>

          {/* Top Feature Importances */}
          <div className="space-y-2 pt-2 border-t border-navy-800">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Top Predictive Features
            </span>
            <div className="space-y-1.5 text-xs">
              {featureImportance.map((f, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-mono text-slate-300">{f.name}</span>
                    <span className="font-mono font-bold text-cyan-400">{f.pct}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-950 overflow-hidden">
                    <div className={`h-full bg-cyan-500 rounded-full ${f.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provenance Notice */}
          <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800 text-[10px] text-slate-400 flex items-start space-x-2">
            <Info className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <p>
              <strong>Evaluation Disclaimer:</strong> Dataset is synthetic, calibrated to IMD Kolkata climate normals and NCRB metro averages. Metrics demonstrate recovery of latent heuristic rules.
            </p>
          </div>
        </div>

        {/* Right: Interactive Scenario Simulator & Live Inference Output (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-navy-800 bg-navy-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-black uppercase text-white">Interactive ML Risk Simulation Lab</h3>
            </div>
            <span className="text-xs text-slate-400">Configure parameters & evaluate</span>
          </div>

          {/* Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Location Selector */}
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">Target Sector / Landmark</label>
              <select
                value={selectedLocIndex}
                onChange={(e) => setSelectedLocIndex(Number(e.target.value))}
                className="w-full rounded-xl bg-navy-950 p-2 border border-navy-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {sampleLocations.map((l, i) => (
                  <option key={i} value={i}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Time of Day */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>Time of Day (Hour)</span>
                <span className="font-mono text-cyan-400">{hour}:00 IST</span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Lighting Condition */}
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">Ambient Illumination</label>
              <select
                value={lighting}
                onChange={(e) => setLighting(Number(e.target.value))}
                className="w-full rounded-xl bg-navy-950 p-2 border border-navy-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={0}>0: Daylight (Standard Sun)</option>
                <option value={1}>1: Artificial Street Lighting</option>
                <option value={2}>2: Poor / Obscured Lighting</option>
              </select>
            </div>

            {/* Crowd Density */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>Pedestrian Density</span>
                <span className="font-mono text-cyan-400">{crowdDensity} / 100m²</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="180"
                step="0.5"
                value={crowdDensity}
                onChange={(e) => setCrowdDensity(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Weather Condition */}
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">Weather Precipitation</label>
              <select
                value={weather}
                onChange={(e) => setWeather(Number(e.target.value))}
                className="w-full rounded-xl bg-navy-950 p-2 border border-navy-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={0}>0: Clear Environment</option>
                <option value={1}>1: Overcast / Cloudy</option>
                <option value={2}>2: Heavy Rain Precipitation</option>
                <option value={3}>3: Severe Storm / Thunderstorm</option>
              </select>
            </div>

            {/* Prior Incidents */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>Historical Incidents (28d)</span>
                <span className="font-mono text-cyan-400">{incidentCount} incidents</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={incidentCount}
                onChange={(e) => setIncidentCount(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleSimulate}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 transition"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Running Random Forest Classification...' : 'Evaluate Telemetry via ML Model'}</span>
            </button>
          </div>

          {/* Inference Result Display */}
          {prediction && (
            <div className="rounded-xl bg-navy-950 p-4 border border-cyan-800/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-black border ${
                    prediction.risk_label === 'High' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                    prediction.risk_label === 'Medium' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {prediction.risk_label.toUpperCase()} RISK CLASSIFICATION
                  </span>
                  <span className="text-xs text-slate-300">
                    Confidence: <strong className="text-white">{(prediction.confidence * 100).toFixed(1)}%</strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Version: {prediction.model_version}
                </span>
              </div>

              {/* Probabilities Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-navy-900 p-2 border border-navy-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">LOW RISK</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {((prediction.probabilities?.Low || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="rounded bg-navy-900 p-2 border border-navy-800">
                  <span className="text-[10px] text-amber-400 font-bold block">MEDIUM RISK</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {((prediction.probabilities?.Medium || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="rounded bg-navy-900 p-2 border border-navy-800">
                  <span className="text-[10px] text-rose-400 font-bold block">HIGH RISK</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {((prediction.probabilities?.High || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Factors */}
              {prediction.factors_summary && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Key Identified Factors:</span>
                  <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                    {prediction.factors_summary.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-950/40 p-3 border border-rose-800/40 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Prediction Service Connection Error</span>
              </div>
              <p>{errorMsg}</p>
              <p className="text-[11px] font-mono text-slate-300">
                To start service: <code className="text-cyan-300">python ml/service.py</code>
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
