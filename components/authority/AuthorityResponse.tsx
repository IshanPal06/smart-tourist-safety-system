'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  AlertOctagon, 
  ShieldCheck, 
  Radio, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Send, 
  Ambulance, 
  Shield, 
  MapPin, 
  User, 
  FileCheck,
  CheckCircle
} from 'lucide-react';
import { getRiskColor } from '@/lib/utils';

export const AuthorityResponse: React.FC = () => {
  const { 
    incidents, 
    selectedIncidentId, 
    emergencyUnits, 
    dispatchResponderToIncident, 
    resolveIncident, 
    verifyDigitalId,
    tourist 
  } = useSafetyStore();

  const activeIncident = 
    incidents.find(i => i.id === selectedIncidentId) || 
    incidents.find(i => i.isSOS && i.status !== 'Resolved') || 
    incidents[0];

  if (!activeIncident) {
    return (
      <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-8 text-center text-slate-400">
        <CheckCircle className="h-10 w-10 mx-auto text-emerald-400 mb-2" />
        <p className="font-bold text-slate-200">No Active Emergency Incidents</p>
        <p className="text-xs">All emergency dispatch queues are clear.</p>
      </div>
    );
  }

  const isResolved = activeIncident.status === 'Resolved';
  const theme = getRiskColor(activeIncident.severity);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            activeIncident.isSOS ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40' : 'bg-blue-600/30 text-blue-400'
          }`}>
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-slate-400">{activeIncident.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badge}`}>
                {activeIncident.severity} SEVERITY
              </span>
              <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-800">
                STATUS: {activeIncident.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">
              {activeIncident.category} • Immediate Tactical Response Console
            </h2>
          </div>
        </div>

        {/* Resolve Button */}
        {!isResolved && (
          <button
            onClick={() => resolveIncident(activeIncident.id)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-950 transition"
          >
            ✓ MARK INCIDENT RESOLVED
          </button>
        )}
      </div>

      {/* Main Grid: Incident Telemetry + Tactical Actions + Response Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Incident Details & Tactical Dispatch Controls */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Telemetry Summary Card */}
          <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              INCIDENT TELEMETRY & DIGITAL ATTESTATION
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">TOURIST</span>
                <p className="font-bold text-slate-100">{activeIncident.touristName}</p>
                <span className="font-mono text-[10px] text-cyan-400">{activeIncident.touristId}</span>
              </div>

              <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">LOCATION</span>
                <p className="font-bold text-slate-100 truncate">{activeIncident.locationName}</p>
                <span className="font-mono text-[10px] text-slate-400">
                  {activeIncident.location[0].toFixed(4)}° N, {activeIncident.location[1].toFixed(4)}° E
                </span>
              </div>

              <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">DIGITAL ID STATUS</span>
                <p className="font-bold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>VERIFIED</span>
                </p>
                <span className="text-[10px] text-slate-400">ZK-Proof Passed</span>
              </div>

              <div className="rounded-xl bg-navy-950 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">AI RISK SCORE</span>
                <p className="font-bold text-rose-400 text-sm">
                  {activeIncident.aiClassification?.riskScore || 95} / 100
                </p>
                <span className="text-[10px] text-cyan-300 font-semibold">Priority {activeIncident.aiClassification?.priority || 'P1'}</span>
              </div>
            </div>

            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">INCIDENT NARRATIVE:</span>
              <p className="text-slate-200 leading-relaxed">{activeIncident.description}</p>
            </div>
          </div>

          {/* Tactical Dispatch Action Toolbar */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-cyan-950/20 to-navy-950 p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>COMMAND ACTIONS & DISPATCH</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => verifyDigitalId()}
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-navy-900 px-3 py-2.5 font-bold text-slate-200 border border-navy-700 hover:bg-navy-800 transition"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>VERIFY ID</span>
              </button>

              <button
                onClick={() => dispatchResponderToIncident(activeIncident.id, 'UNIT-P17')}
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-blue-600/30 px-3 py-2.5 font-bold text-blue-200 border border-blue-500/40 hover:bg-blue-600/40 transition"
              >
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>DISPATCH POLICE (P-17)</span>
              </button>

              <button
                onClick={() => dispatchResponderToIncident(activeIncident.id, 'UNIT-AMB04')}
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600/30 px-3 py-2.5 font-bold text-rose-200 border border-rose-500/40 hover:bg-rose-600/40 transition"
              >
                <Ambulance className="h-4 w-4 text-rose-400" />
                <span>DISPATCH AMBULANCE (A-04)</span>
              </button>

              <a
                href={`tel:${tourist.digitalId.emergencyContact.phone}`}
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-navy-900 px-3 py-2.5 font-bold text-slate-200 border border-navy-700 hover:bg-navy-800 transition"
              >
                <PhoneCall className="h-4 w-4 text-cyan-400" />
                <span>CONTACT KIN ({tourist.digitalId.emergencyContact.name.split(' ')[0]})</span>
              </a>

              <button
                onClick={() => resolveIncident(activeIncident.id)}
                className="col-span-2 flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600/30 px-3 py-2.5 font-bold text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/40 transition"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>MARK RESOLVED</span>
              </button>
            </div>
          </div>

          {/* Assigned Unit Telemetry */}
          {activeIncident.assignedUnit && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{activeIncident.assignedUnit.callSign}</div>
                  <p className="text-slate-300 text-xs">En Route to {activeIncident.locationName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-black text-emerald-400">
                  ETA {activeIncident.assignedUnit.etaMinutes || 3} MIN
                </span>
                <div className="text-[11px] text-slate-400 font-mono">
                  Distance: {activeIncident.assignedUnit.distanceKm || 1.4} km
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Animated Real-Time Response Timeline */}
        <div className="lg:col-span-1 rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl flex flex-col">
          <div className="flex items-center space-x-2 border-b border-navy-800 pb-3 mb-3">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              RESPONSE TIMELINE (CAD ENGINE)
            </h3>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {activeIncident.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start space-x-3 text-xs">
                {/* Timeline connector dot */}
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                    ✓
                  </div>
                  {idx < activeIncident.timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-navy-800 my-0.5" />
                  )}
                </div>

                {/* Timeline content */}
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{item.event}</span>
                    <span className="font-mono text-[10px] text-cyan-400">{item.time}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Actor: {item.actor}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
