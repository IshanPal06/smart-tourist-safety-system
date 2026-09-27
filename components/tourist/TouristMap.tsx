'use client';

import React from 'react';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { useSafetyStore } from '@/store/safetyStore';
import { Shield, Radio, Navigation, AlertTriangle, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

export const TouristMap: React.FC = () => {
  const { tourist, setTouristLocation } = useSafetyStore();

  const landmarkTeleports = [
    { name: 'Park Street', lat: 22.5535, lng: 88.3524, type: 'Safe' },
    { name: 'Victoria Memorial', lat: 22.5448, lng: 88.3426, type: 'Safe' },
    { name: 'Esplanade', lat: 22.5645, lng: 88.3520, type: 'Caution' },
    { name: 'Howrah Station', lat: 22.5840, lng: 88.3428, type: 'High Risk' },
    { name: 'Prinsep Ghat', lat: 22.5558, lng: 88.3315, type: 'Safe' },
    { name: 'Eco Park', lat: 22.6022, lng: 88.4658, type: 'Safe' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Interactive Safety Map</h2>
          <p className="text-xs text-slate-400">
            Real-time geofenced boundaries, crowd clusters & response units
          </p>
        </div>
        <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
          SIMULATED DATA
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

      {/* Main Map */}
      <div className="overflow-hidden rounded-2xl border border-navy-800 shadow-2xl">
        <LeafletMap height="460px" interactiveTourist={true} />
      </div>

      {/* Quick Teleport Landmarks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span>Demonstration Kolkata Landmarks:</span>
          </span>
          <span>Click to teleport</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {landmarkTeleports.map((place) => (
            <button
              key={place.name}
              onClick={() => setTouristLocation(place.lat, place.lng, place.name)}
              className={`rounded-xl p-2 text-left text-xs transition border ${
                place.type === 'Safe' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-slate-200'
                  : place.type === 'Caution'
                  ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-slate-200'
                  : 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-slate-200'
              }`}
            >
              <div className="font-bold truncate text-[11px]">{place.name}</div>
              <div className={`text-[10px] font-semibold ${
                place.type === 'Safe' ? 'text-emerald-400' : place.type === 'Caution' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                ● {place.type}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
