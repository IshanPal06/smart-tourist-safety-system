'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { Users, TrendingUp, AlertTriangle, Sparkles, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthorityCrowd: React.FC = () => {
  const { crowdZones, selectedCrowdZoneId, setSelectedCrowdZoneId, addToast } = useSafetyStore();

  const selectedZone = crowdZones.find(z => z.id === selectedCrowdZoneId) || crowdZones[2];

  const handleBroadcastReroute = () => {
    addToast(
      'Tactical Crowd Reroute Broadcasted',
      `Dynamic signage and tourist app advisories updated to divert traffic from ${selectedZone.name} to Zone B.`,
      'success'
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <span>Vision AI Crowd Density & Flow Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time pedestrian velocity, bottleneck predictions & autonomous flow diversion
          </p>
        </div>
      </div>

      {/* 4 Major Monitored Zones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {crowdZones.map((zone) => {
          const isSelected = selectedCrowdZoneId === zone.id;
          const isHigh = zone.level === 'HIGH' || zone.level === 'SEVERE';
          const isModerate = zone.level === 'MODERATE';

          return (
            <div
              key={zone.id}
              onClick={() => setSelectedCrowdZoneId(zone.id)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-500 bg-gradient-to-b from-navy-900 to-navy-950 shadow-xl shadow-cyan-950/40 scale-[1.02]'
                  : 'border-navy-800 bg-navy-900/70 hover:border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-cyan-400">{zone.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isHigh ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  isModerate ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {zone.level}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white truncate">{zone.name}</h3>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{zone.densityPercent}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  Pred: <strong className="text-cyan-400">{zone.predictedDensityPercent}%</strong>
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isHigh ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-400'}`}
                  style={{ width: `${zone.densityPercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>{zone.touristCount} Visitors</span>
                <span>{zone.recentIncidents} Incidents</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Deep Dive Analytics Card */}
      {selectedZone && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-cyan-950/20 to-navy-950 p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-black text-cyan-400">{selectedZone.code}</span>
                <span className="text-lg font-black text-white">{selectedZone.name}</span>
              </div>
              <p className="text-xs text-slate-400">Tactical Crowd Telemetry & Vision AI Anomaly Insights</p>
            </div>

            <button
              onClick={handleBroadcastReroute}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-950 hover:from-cyan-500 hover:to-blue-500 transition"
            >
              <Navigation className="h-4 w-4" />
              <span>BROADCAST DIVERSION ADVISORY</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">CURRENT DENSITY</span>
              <p className="text-2xl font-black text-rose-400">{selectedZone.densityPercent}%</p>
            </div>

            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">PREDICTED DENSITY (30m)</span>
              <p className="text-2xl font-black text-cyan-400">{selectedZone.predictedDensityPercent}%</p>
            </div>

            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">ACTIVE TOURISTS</span>
              <p className="text-2xl font-black text-white">{selectedZone.touristCount}</p>
            </div>

            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">RECENT INCIDENTS</span>
              <p className="text-2xl font-black text-amber-400">{selectedZone.recentIncidents}</p>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-950/40 p-3.5 border border-cyan-800/40 text-xs text-cyan-200 flex items-start space-x-2.5">
            <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">AI Autonomous Crowd Management Recommendation:</strong>
              “{selectedZone.recommendation}”
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
