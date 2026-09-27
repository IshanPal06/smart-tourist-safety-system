'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  Zap, 
  CloudSun, 
  Users, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  RotateCcw, 
  ShieldAlert, 
  MapPin,
  Sparkles,
  Play
} from 'lucide-react';

export const PresenterControlPanel: React.FC = () => {
  const { 
    setTouristLocation, 
    simulateWeatherAlert, 
    simulateCrowdSpike, 
    submitIncidentReport, 
    triggerSOS, 
    dispatchResponderToIncident, 
    resolveIncident, 
    resetDemo,
    incidents,
    tourist 
  } = useSafetyStore();

  const activeInc = incidents.find(i => i.status !== 'Resolved');

  return (
    <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 shadow-2xl space-y-4">
      
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            PRESENTER & HACKATHON JUDGE CONTROL PANEL
          </h3>
        </div>
        <span className="rounded bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
          MANUAL SCENARIO TRIGGERS
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Trigger individual safety lifecycle events on-demand during live demonstrations:
      </p>

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        
        <button
          onClick={() => setTouristLocation(22.5684, 88.3615, 'Bowbazar Construction Zone')}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2.5 font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition"
        >
          <MapPin className="h-4 w-4" />
          <span>SIMULATE GEOFENCE</span>
        </button>

        <button
          onClick={simulateWeatherAlert}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-sky-500/20 px-3 py-2.5 font-bold text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 transition"
        >
          <CloudSun className="h-4 w-4" />
          <span>SIMULATE WEATHER</span>
        </button>

        <button
          onClick={simulateCrowdSpike}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-purple-500/20 px-3 py-2.5 font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition"
        >
          <Users className="h-4 w-4" />
          <span>SIMULATE CROWD SPIKE</span>
        </button>

        <button
          onClick={() => submitIncidentReport('Suspicious Activity', 'Reported aggressive touts blocking alley', 'HIGH')}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-rose-500/20 px-3 py-2.5 font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>SIMULATE INCIDENT</span>
        </button>

        <button
          onClick={() => triggerSOS()}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600 px-3 py-2.5 font-black text-white shadow-lg shadow-rose-950 hover:bg-rose-500 transition"
        >
          <Radio className="h-4 w-4 animate-pulse" />
          <span>TRIGGER SOS</span>
        </button>

        <button
          onClick={() => {
            if (activeInc) dispatchResponderToIncident(activeInc.id, 'UNIT-P17');
          }}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-blue-600/30 px-3 py-2.5 font-bold text-blue-200 border border-blue-500/40 hover:bg-blue-600/40 transition"
        >
          <Radio className="h-4 w-4" />
          <span>DISPATCH RESPONDER</span>
        </button>

        <button
          onClick={() => {
            if (activeInc) resolveIncident(activeInc.id);
          }}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600/30 px-3 py-2.5 font-bold text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/40 transition"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>RESOLVE INCIDENT</span>
        </button>

        <button
          onClick={resetDemo}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-navy-800 px-3 py-2.5 font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 transition"
        >
          <RotateCcw className="h-4 w-4" />
          <span>RESET SYSTEM</span>
        </button>

      </div>
    </div>
  );
};
