'use client';

import React from 'react';
import Link from 'next/link';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  Shield, 
  MapPin, 
  Users, 
  CloudSun, 
  AlertTriangle, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Radio,
  Thermometer,
  CloudRain,
  Eye,
  Wind,
  Clock,
  WifiOff
} from 'lucide-react';
import { getRiskColor } from '@/lib/utils';
import { TouristMLPredictionCard } from '@/components/tourist/TouristMLPredictionCard';
import { InteractiveTouristMap } from '@/components/maps/InteractiveTouristMap';

export const TouristHome: React.FC = () => {
  const { tourist, setTouristLocation } = useSafetyStore();
  const { safetyScore, environmentalConditions } = tourist;
  const riskTheme = getRiskColor(safetyScore.riskLevel);

  // SVG circular gauge math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safetyScore.score / 100) * circumference;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Greeting & Location Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Good evening, {tourist.name.split(' ')[0]}
            </h2>
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-300">
            “Your safety companion is active.”
          </p>
        </div>

        {/* Bubble Status Icon */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400">Smart Shield</span>
          <span className="flex items-center space-x-1 rounded-full bg-cyan-950/80 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-800/60">
            <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>PROTECTED</span>
          </span>
        </div>
      </div>

      {/* Location Badge Card */}
      <div className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-navy-800">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">CURRENT LOCATION</span>
            <div className="text-xs font-bold text-slate-100">{tourist.currentLocation.name}</div>
          </div>
        </div>
        <Link 
          href="/tourist/map" 
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
        >
          <span>Map</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Prominent Interactive Kolkata Tourist Safety Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Interactive Kolkata Safety Map
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">OpenStreetMap • Leaflet</span>
        </div>
        <InteractiveTouristMap height="480px" />
      </div>

      {/* Main Safety Status & Circular Gauge Card */}
      <div className="relative overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-b from-navy-950 to-navy-900 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              CURRENT SAFETY STATUS
            </h3>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${riskTheme.badge}`}>
            {safetyScore.riskLevel} RISK
          </span>
        </div>

        {/* Circular Score Gauge & Key Metrics */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
          
          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-navy-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                style={{
                  stroke: riskTheme.hex,
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
                }}
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-white">
                {safetyScore.score}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                / 100
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                SAFETY SCORE
              </span>
            </div>
          </div>

          {/* Detailed 5-Factor Score Breakdown */}
          <div className="w-full sm:w-1/2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-navy-900/80 px-2.5 py-1.5 border border-navy-800">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Environmental</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {safetyScore.factors.environmental?.score || 82}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-navy-900/80 px-2.5 py-1.5 border border-navy-800">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                <span>Crowd</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {safetyScore.factors.crowdDensity.score}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-navy-900/80 px-2.5 py-1.5 border border-navy-800">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                <span>Location</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {safetyScore.factors.locationRisk?.score || 74}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-navy-900/80 px-2.5 py-1.5 border border-navy-800">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>Incident Proximity</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {safetyScore.factors.crimeRisk.score}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-navy-900/80 px-2.5 py-1.5 border border-navy-800">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <CloudSun className="h-3.5 w-3.5 text-sky-400" />
                <span>Weather</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {safetyScore.factors.weatherRisk.score}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Environmental Conditions Card */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2">
          <div className="flex items-center space-x-2">
            <CloudSun className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              ENVIRONMENTAL CONDITIONS
            </h4>
          </div>
          <span className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
            <Clock className="h-3 w-3" />
            <span>{environmentalConditions.lastUpdated}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800 space-y-0.5">
            <span className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Thermometer className="h-3 w-3 text-orange-400" />
              <span>TEMPERATURE</span>
            </span>
            <p className="font-bold text-white text-sm">{environmentalConditions.temperature}°C</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800 space-y-0.5">
            <span className="flex items-center space-x-1 text-[10px] text-slate-400">
              <CloudRain className="h-3 w-3 text-sky-400" />
              <span>RAIN CHANCE</span>
            </span>
            <p className="font-bold text-white text-sm">{environmentalConditions.rainProbability}%</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800 space-y-0.5">
            <span className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Eye className="h-3 w-3 text-cyan-400" />
              <span>VISIBILITY</span>
            </span>
            <p className="font-bold text-white text-sm">{environmentalConditions.visibilityKm} km</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800 space-y-0.5">
            <span className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Wind className="h-3 w-3 text-teal-400" />
              <span>WIND SPEED</span>
            </span>
            <p className="font-bold text-white text-sm">{environmentalConditions.windSpeedKmh} km/h</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300">
          <span>Overall Weather Risk Level:</span>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/30">
            {environmentalConditions.weatherRisk} RISK
          </span>
        </div>
      </div>

      {/* Real-time ML Safety Risk Prediction */}
      <TouristMLPredictionCard />

      {/* AI Safety Summary Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-cyan-950/20 to-navy-950 p-4 shadow-lg space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            AI SAFETY SUMMARY
          </h4>
        </div>
        
        <p className="text-xs leading-relaxed text-slate-200 font-medium">
          “{safetyScore.recommendation}”
        </p>

        {safetyScore.alternativeRouteSummary && (
          <div className="rounded-xl bg-emerald-950/30 p-2.5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>Suggested Bypass:</strong> {safetyScore.alternativeRouteSummary}</span>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/tourist/map"
            className="flex items-center justify-center space-x-1.5 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-950/40 hover:bg-cyan-500 transition"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>VIEW SAFETY MAP</span>
          </Link>

          <button
            onClick={() => {
              setTouristLocation(22.5512, 88.3540, 'Middleton Row Green Corridor');
            }}
            className="flex items-center justify-center space-x-1.5 rounded-xl bg-navy-800 py-2.5 text-xs font-bold text-cyan-300 border border-navy-700 hover:bg-navy-700 transition"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>GET SAFE ROUTE</span>
          </button>
        </div>
      </div>

      {/* Quick Links to Offline Mode & Personalized Profile */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/tourist/offline"
          className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs font-bold text-slate-300 hover:border-cyan-500/30 transition"
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4 text-purple-400" />
            <span>Offline Safety Mode</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-500" />
        </Link>

        <Link
          href="/tourist/profile"
          className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs font-bold text-slate-300 hover:border-cyan-500/30 transition"
        >
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Safety Profile</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-500" />
        </Link>
      </div>

    </div>
  );
};
