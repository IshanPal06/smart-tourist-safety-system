'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { useSafetyStore } from '@/store/safetyStore';
import { Incident } from '@/types';
import { 
  Radio, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Users,
  Ambulance,
  PhoneCall,
  ShieldCheck,
  X,
  Send,
  Lock,
  Activity,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatTimeAgo, getRiskColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const AuthorityOverview: React.FC = () => {
  const router = useRouter();
  const { 
    incidents, 
    selectedIncidentId, 
    setSelectedIncidentId,
    isIncidentDetailOpen,
    setIsIncidentDetailOpen,
    dispatchResponderToIncident,
    resolveIncident,
    verifyDigitalId,
    emergencyUnits,
    tourist,
    geofences,
    alerts
  } = useSafetyStore();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || activeIncidents[0] || incidents[0];

  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncidentId(inc.id);
    setIsIncidentDetailOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Bar: Emergency Operations Center Header & Simulated Live Clock */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">SMART TOURIST SAFETY</h2>
              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Emergency Operations Center (EOC) • Municipal Situation Awareness
            </p>
          </div>
        </div>

        {/* Live Clock */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="rounded-xl bg-navy-950 px-3 py-1.5 border border-navy-800 font-mono text-cyan-300 flex items-center space-x-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{currentTime || '16:40:11 IST'}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Command Center KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>ACTIVE TOURISTS</span>
            <span className="text-emerald-400 font-bold flex items-center text-[9px]">
              <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> +4.2%
            </span>
          </div>
          <div className="text-xl font-black text-white">1,842</div>
          <p className="text-[9px] text-slate-400">Across 20 Zones</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>HIGH-RISK TOURISTS</span>
            <span className="text-emerald-400 font-bold flex items-center text-[9px]">
              <TrendingDown className="h-2.5 w-2.5 mr-0.5" /> -3.1%
            </span>
          </div>
          <div className="text-xl font-black text-amber-400">27</div>
          <p className="text-[9px] text-slate-400">Caution Boundaries</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>ACTIVE INCIDENTS</span>
            <span className="text-rose-400 font-bold text-[9px]">+2 New</span>
          </div>
          <div className="text-xl font-black text-rose-400 flex items-center gap-1">
            <span>{activeIncidents.length}</span>
            {activeIncidents.length > 0 && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
          </div>
          <p className="text-[9px] text-slate-400">CAD Triage Queue</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>ACTIVE RESPONSES</span>
            <span className="text-cyan-400 font-mono text-[9px]">ETA &lt;3m</span>
          </div>
          <div className="text-xl font-black text-cyan-400">6</div>
          <p className="text-[9px] text-slate-400">Units On Scene</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>GEOFENCES</span>
            <span className="text-emerald-400 text-[9px]">100% Active</span>
          </div>
          <div className="text-xl font-black text-slate-200">{geofences.length + 18}</div>
          <p className="text-[9px] text-slate-400">Perimeters Monitored</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-3 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>AI ALERTS</span>
            <span className="text-cyan-400 font-mono text-[9px]">Real-time</span>
          </div>
          <div className="text-xl font-black text-emerald-400">{alerts.length + 87}</div>
          <p className="text-[9px] text-slate-400">Synthesized Insights</p>
        </div>
      </div>

      {/* Main Grid: Command Center Map + Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-bold flex items-center space-x-1.5">
              <Radio className="h-4 w-4 text-cyan-400" />
              <span>Kolkata Metropolitan Live Safety Grid</span>
            </span>
            <span className="text-[11px] text-slate-400">Click any marker or incident for telemetry</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-800 shadow-2xl">
            <LeafletMap 
              height="550px" 
              showAllTourists={true} 
              onSelectIncident={handleSelectIncident} 
            />
          </div>
        </div>

        {/* Right 1 Col: Live Incident Feed */}
        <div className="lg:col-span-1 rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl flex flex-col h-[585px]">
          
          <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                LIVE INCIDENT FEED
              </h3>
            </div>
            <Link 
              href="/authority/incidents"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Incident Feed List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {incidents.map((inc) => {
              const theme = getRiskColor(inc.severity);
              const isSOS = inc.isSOS;
              const isSelected = selectedIncidentId === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`group rounded-xl border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/50'
                      : isSOS 
                      ? 'border-rose-500/50 bg-rose-950/20 shadow-md shadow-rose-950/40' 
                      : 'border-navy-800 bg-navy-950/80 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      {isSOS && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
                      <span>{inc.id}</span>
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${theme.badge}`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                    {inc.category}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center space-x-1 truncate max-w-[170px]">
                      <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{inc.locationName}</span>
                    </span>
                    <span className="font-mono text-[10px] shrink-0">{formatTimeAgo(inc.timestamp)}</span>
                  </div>

                  {inc.assignedUnit && (
                    <div className="mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 truncate">
                      Unit: {inc.assignedUnit.callSign}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Slide-out / Expanded Incident Detail Panel */}
      {isIncidentDetailOpen && selectedIncident && (
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
          
          <div className="flex items-start justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{selectedIncident.id}</span>
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                    {selectedIncident.severity}
                  </span>
                  <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
                    STATUS: {selectedIncident.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {selectedIncident.category} • Incident Dispatch Details
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsIncidentDetailOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400">TOURIST</span>
              <p className="font-bold text-slate-200">{selectedIncident.touristName}</p>
              <span className="font-mono text-[10px] text-cyan-400">{selectedIncident.touristId}</span>
            </div>

            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400">LOCATION</span>
              <p className="font-bold text-slate-200 truncate">{selectedIncident.locationName}</p>
              <span className="font-mono text-[10px] text-slate-400">
                {selectedIncident.location[0].toFixed(4)}° N, {selectedIncident.location[1].toFixed(4)}° E
              </span>
            </div>

            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400">AI RISK SCORE</span>
              <p className="font-bold text-rose-400 text-sm">
                {selectedIncident.aiClassification?.riskScore || 88}/100
              </p>
              <span className="text-[10px] text-cyan-300">Confidence {Math.round((selectedIncident.aiClassification?.confidence || 0.93) * 100)}%</span>
            </div>

            <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
              <span className="text-[10px] text-slate-400">ASSIGNED UNIT</span>
              <p className="font-bold text-emerald-400">{selectedIncident.assignedUnit?.callSign || 'None'}</p>
              <span className="text-[10px] text-slate-400">ETA {selectedIncident.assignedUnit?.etaMinutes || 2} min</span>
            </div>
          </div>

          <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">INCIDENT DESCRIPTION & AI FACTORS:</span>
            <p className="text-slate-200">{selectedIncident.description}</p>
            {selectedIncident.aiClassification?.factors && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedIncident.aiClassification.factors.map((f, i) => (
                  <span key={i} className="rounded bg-navy-900 px-2 py-0.5 text-[10px] text-cyan-300 border border-navy-800">
                    ● {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => verifyDigitalId()}
              className="flex items-center space-x-1.5 rounded-xl bg-navy-900 px-3 py-2 font-bold text-slate-200 border border-navy-700 hover:bg-navy-800 transition"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>VERIFY ID</span>
            </button>

            <button
              onClick={() => dispatchResponderToIncident(selectedIncident.id, 'UNIT-P17')}
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600/30 px-3 py-2 font-bold text-blue-200 border border-blue-500/40 hover:bg-blue-600/40 transition"
            >
              <Radio className="h-4 w-4 text-cyan-400" />
              <span>DISPATCH POLICE (P-17)</span>
            </button>

            <button
              onClick={() => dispatchResponderToIncident(selectedIncident.id, 'UNIT-AMB04')}
              className="flex items-center space-x-1.5 rounded-xl bg-rose-600/30 px-3 py-2 font-bold text-rose-200 border border-rose-500/40 hover:bg-rose-600/40 transition"
            >
              <Ambulance className="h-4 w-4 text-rose-400" />
              <span>DISPATCH AMBULANCE (A-04)</span>
            </button>

            <a
              href={`tel:${tourist.digitalId.emergencyContact.phone}`}
              className="flex items-center space-x-1.5 rounded-xl bg-navy-900 px-3 py-2 font-bold text-slate-200 border border-navy-700 hover:bg-navy-800 transition"
            >
              <PhoneCall className="h-4 w-4 text-cyan-400" />
              <span>CONTACT KIN</span>
            </a>

            {selectedIncident.status !== 'Resolved' && (
              <button
                onClick={() => resolveIncident(selectedIncident.id)}
                className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-black text-white shadow-lg shadow-emerald-950 hover:bg-emerald-500 transition ml-auto"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>MARK RESOLVED</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
