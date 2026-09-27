'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  Building, 
  Radio, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Battery, 
  Wifi,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  MapPin,
  Moon,
  Users,
  Compass,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const TouristProfile: React.FC = () => {
  const { tourist, toggleSafetyBubble, setPrivacyMode } = useSafetyStore();
  const { digitalId, behaviorRiskProfile } = tourist;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="flex items-center space-x-3.5 rounded-2xl border border-navy-800 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-4 shadow-xl">
        <div className="relative">
          <img
            src={tourist.avatarUrl}
            alt={tourist.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
            ✓
          </span>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-white">{tourist.name}</h2>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              VERIFIED
            </span>
          </div>
          <p className="font-mono text-xs text-cyan-400">{digitalId.idNumber}</p>
          <p className="text-[11px] text-slate-400">{digitalId.nationality} • Issued Sep 2026</p>
        </div>
      </div>

      {/* Personalized Safety Behavior Dimensions */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              YOUR SAFETY PROFILE & BEHAVIOR INDEX
            </h3>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
            LOW RISK
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>ROUTE SAFETY</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">Low Risk</span>
              <span className="font-mono text-[10px] text-slate-400">88/100</span>
            </div>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <Moon className="h-3.5 w-3.5 text-amber-400" />
              <span>NIGHT TRAVEL</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">Moderate</span>
              <span className="font-mono text-[10px] text-slate-400">68/100</span>
            </div>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>CROWD EXPOSURE</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">Low Exposure</span>
              <span className="font-mono text-[10px] text-slate-400">84/100</span>
            </div>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <MapPin className="h-3.5 w-3.5 text-orange-400" />
              <span>REMOTE AREAS</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400">Elevated</span>
              <span className="font-mono text-[10px] text-slate-400">58/100</span>
            </div>
          </div>
        </div>

        {/* Personalized Behavioral Recommendations */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>PERSONALIZED SAFETY RECOMMENDATIONS</span>
          </div>

          <div className="space-y-1.5">
            {behaviorRiskProfile.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 rounded-xl bg-navy-900/90 p-2.5 border border-navy-800 text-xs text-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-navy-900/60 p-2 text-[10px] text-slate-400 flex items-center space-x-1.5 border border-navy-800">
            <Lock className="h-3 w-3 text-cyan-400 shrink-0" />
            <span>
              Recommendations are computed solely from spatial movement and environmental context. No sensitive personal data is stored.
            </span>
          </div>
        </div>
      </div>

      {/* Safety Bubble & Privacy Controls */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 space-y-3 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          SAFETY COMPANION SETTINGS
        </h3>

        {/* Invisible Safety Bubble Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-navy-900/80 p-3 border border-navy-800 text-xs">
          <div className="flex items-center space-x-2.5">
            <Radio className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="font-bold text-slate-100">Invisible Safety Bubble (180m)</span>
              <p className="text-[11px] text-slate-400">Autonomous edge environmental threat detection</p>
            </div>
          </div>
          <button
            onClick={toggleSafetyBubble}
            className="text-cyan-400 hover:text-cyan-300 transition text-2xl"
          >
            {tourist.invisibleSafetyBubbleActive ? <ToggleRight className="h-7 w-7 text-cyan-400" /> : <ToggleLeft className="h-7 w-7 text-slate-600" />}
          </button>
        </div>

        {/* Privacy Mode Selector */}
        <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100">Location Privacy Level</span>
            <span className="font-mono text-cyan-400 font-bold">{tourist.privacyMode} MODE</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {(['NORMAL', 'RISK', 'EMERGENCY'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPrivacyMode(mode)}
                className={`py-1.5 rounded-lg font-bold border transition ${
                  tourist.privacyMode === mode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact & Accommodation Info */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 space-y-3 shadow-lg text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          EMERGENCY DATA & ACCOMMODATION
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400">
              <Phone className="h-3 w-3 text-cyan-400" />
              <span>EMERGENCY CONTACT</span>
            </span>
            <p className="font-bold text-slate-200">{digitalId.emergencyContact.name}</p>
            <p className="font-mono text-[11px] text-cyan-400">{digitalId.emergencyContact.phone}</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
            <span className="flex items-center space-x-1 text-slate-400">
              <Heart className="h-3 w-3 text-rose-400" />
              <span>BLOOD GROUP</span>
            </span>
            <p className="font-bold text-white">{digitalId.bloodGroup}</p>
            <p className="text-[10px] text-slate-400">Pre-Attested in Passport</p>
          </div>
        </div>

        <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-1">
          <span className="flex items-center space-x-1 text-slate-400">
            <Building className="h-3 w-3 text-cyan-400" />
            <span>HOTEL ACCOMMODATION</span>
          </span>
          <p className="font-bold text-slate-200">{digitalId.hotelAccommodation}</p>
        </div>
      </div>

    </div>
  );
};
