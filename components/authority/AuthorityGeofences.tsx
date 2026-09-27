'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { GeofenceZone, RiskLevel } from '@/types';
import { Shield, Plus, MapPin, AlertTriangle, Compass, CheckCircle2, X, Edit3, Power, Sparkles } from 'lucide-react';
import { getRiskColor } from '@/lib/utils';

export const AuthorityGeofences: React.FC = () => {
  const { geofences, addGeofence, updateGeofence, toggleGeofenceStatus, setTouristLocation } = useSafetyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<GeofenceZone['type']>('CAUTION');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MODERATE');
  const [radius, setRadius] = useState<number>(450);
  const [description, setDescription] = useState('');
  const [advisory, setAdvisory] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGeofence({
      name,
      type,
      riskLevel,
      radius,
      center: [22.5535 + (Math.random() - 0.5) * 0.04, 88.3524 + (Math.random() - 0.5) * 0.04],
      description: description || 'Custom municipal security perimeter established via CAD Command.',
      crowdLevel: 'Moderate',
      advisory: advisory || 'Follow designated pedestrian walkways and stay in well-lit areas.',
      nearestPoliceUnit: 'P-17 Outpost',
      nearestHospital: 'SSKM Medical Center',
      predictedRisk: riskLevel,
      aiRecommendation: 'Autonomous perimeter active. Edge telemetry scanning enabled.',
    });

    setName('');
    setDescription('');
    setAdvisory('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>Geofence Perimeter Security Management</span>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-800">
              {geofences.length} Active Perimeters
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Define spatial hazard boundaries, set crowd thresholds & trigger autonomous warnings
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-950 hover:from-cyan-500 hover:to-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>CREATE GEOFENCE</span>
        </button>
      </div>

      {/* Geofences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {geofences.map((zone) => {
          const theme = getRiskColor(zone.riskLevel);
          const isActive = zone.status !== 'INACTIVE';

          return (
            <div
              key={zone.id}
              className={`rounded-2xl border p-4 shadow-lg space-y-2.5 transition ${
                isActive ? 'border-navy-800 bg-navy-900/90' : 'border-navy-900 bg-navy-950/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{zone.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badge}`}>
                    {zone.type} ZONE ({zone.riskLevel})
                  </span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isActive ? '● ACTIVE' : '○ INACTIVE'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => toggleGeofenceStatus(zone.id)}
                    title={isActive ? 'Deactivate Geofence' : 'Activate Geofence'}
                    className="p-1.5 rounded-lg bg-navy-950 text-slate-400 hover:text-white border border-navy-800"
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => setTouristLocation(zone.center[0], zone.center[1], zone.name)}
                    title="Teleport Tourist to Zone"
                    className="p-1.5 rounded-lg bg-navy-950 text-cyan-400 hover:text-cyan-300 border border-navy-800"
                  >
                    <Compass className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-white">{zone.name}</h3>
              <p className="text-xs text-slate-300 leading-snug">{zone.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="rounded bg-navy-950 p-1.5 border border-navy-800 text-center">
                  <span className="text-slate-400 text-[10px] block">RADIUS</span>
                  <span className="font-mono font-bold text-slate-200">{zone.radius}m</span>
                </div>
                <div className="rounded bg-navy-950 p-1.5 border border-navy-800 text-center">
                  <span className="text-slate-400 text-[10px] block">CROWD</span>
                  <span className="font-bold text-amber-400">{zone.crowdLevel}</span>
                </div>
                <div className="rounded bg-navy-950 p-1.5 border border-navy-800 text-center">
                  <span className="text-slate-400 text-[10px] block">INCIDENTS</span>
                  <span className="font-bold text-rose-400">{zone.activeIncidentsCount} Active</span>
                </div>
              </div>

              <div className="rounded-lg bg-navy-950 p-2 text-xs border border-navy-800 text-cyan-300">
                <strong>Advisory:</strong> {zone.advisory}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE GEOFENCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-navy-900 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span>CREATE GEOFENCE SECURITY PERIMETER</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Perimeter Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sudder Street Heritage Walkway"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950 p-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Perimeter Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-navy-700 bg-navy-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="SAFE">Safe Zone</option>
                    <option value="CAUTION">Warning / Caution Zone</option>
                    <option value="HIGH_RISK">Restricted / High Risk Zone</option>
                    <option value="EMERGENCY">Emergency Zone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-navy-700 bg-navy-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Radius (Meters): {radius}m</label>
                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={50}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Rationale</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special festival crowd corridor with reinforced patrols"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950 p-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tourist Edge Advisory Text</label>
                <input
                  type="text"
                  value={advisory}
                  onChange={(e) => setAdvisory(e.target.value)}
                  placeholder="e.g. Illuminated corridor active; follow safety squad guidance"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950 p-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl bg-navy-800 py-3 font-bold text-slate-300 hover:bg-navy-700 transition"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-black text-white shadow-lg shadow-cyan-950 hover:from-cyan-500 hover:to-blue-500 transition"
                >
                  SAVE GEOFENCE
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
