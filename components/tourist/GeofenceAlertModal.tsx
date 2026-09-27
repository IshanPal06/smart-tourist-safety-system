'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { AlertTriangle, ShieldCheck, PhoneCall, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export const GeofenceAlertModal: React.FC = () => {
  const { activeGeofenceAlert, dismissGeofenceAlert, setTouristLocation, triggerSOS } = useSafetyStore();

  if (!activeGeofenceAlert) return null;

  const { zone, reason, suggestedAction } = activeGeofenceAlert;
  const isHighRisk = zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL';

  const handleTakeSaferRoute = () => {
    // Reroute to safe Park Street corridor
    setTouristLocation(22.5535, 88.3524, 'Park Street Tourist Safe Corridor');
    dismissGeofenceAlert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-gradient-to-b from-navy-900 to-navy-950 p-6 shadow-2xl shadow-amber-950/40 space-y-4">
        
        {/* Close Button */}
        <button
          onClick={dismissGeofenceAlert}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800">
                GEOFENCE ALERT
              </span>
              <span className={`text-xs font-bold ${isHighRisk ? 'text-rose-400' : 'text-amber-400'}`}>
                {zone.riskLevel} RISK
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Approaching Elevated-Risk Area
            </h3>
          </div>
        </div>

        {/* Location & Details Card */}
        <div className="rounded-xl bg-navy-950/90 p-3.5 border border-navy-800 space-y-2 text-xs">
          <div>
            <span className="text-slate-400">Boundary Zone:</span>
            <p className="font-bold text-slate-100">{zone.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Identified Reason:</span>
            <p className="text-slate-200">{reason}</p>
          </div>
          <div className="rounded bg-navy-900 p-2 border border-navy-700/60 text-cyan-300">
            <strong>Advisory:</strong> {suggestedAction}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleTakeSaferRoute}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/30 hover:from-emerald-500 hover:to-teal-500 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>VIEW & SWITCH TO SAFER ROUTE</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={dismissGeofenceAlert}
              className="flex-1 rounded-xl bg-navy-800 py-2.5 text-xs font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 transition"
            >
              CONTINUE ANYWAY
            </button>
            <button
              onClick={() => {
                dismissGeofenceAlert();
                triggerSOS();
              }}
              className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600/20 py-2.5 text-xs font-bold text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 transition"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>EMERGENCY SUPPORT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
