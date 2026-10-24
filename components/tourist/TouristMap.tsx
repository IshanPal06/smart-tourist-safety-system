'use client';

import React from 'react';
import { InteractiveTouristMap } from '@/components/maps/InteractiveTouristMap';
import { useSafetyStore } from '@/store/safetyStore';
import { Shield, Radio, Navigation, AlertTriangle, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

export const TouristMap: React.FC = () => {
  const { tourist } = useSafetyStore();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Interactive Kolkata Safety Map</h2>
          <p className="text-xs text-slate-400">
            OpenStreetMap geospatial visualization with real-time ML risk inference & telemetry
          </p>
        </div>
        <span className="rounded-md bg-cyan-950 px-2 py-1 text-[10px] font-semibold text-cyan-300 border border-cyan-800">
          OpenStreetMap • Leaflet
        </span>
      </div>

      {/* Invisible Safety Bubble Banner */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-cyan-950/60 to-navy-950 p-3 border border-cyan-500/30 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-cyan-300">INVISIBLE SAFETY BUBBLE</span>
              <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[9px] font-bold text-cyan-400 border border-cyan-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Continuously evaluates environmental and location risk around your 180m radius.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Map with Search, Filters, Locate Me, and ML Integration */}
      <InteractiveTouristMap height="580px" />

    </div>
  );
};
