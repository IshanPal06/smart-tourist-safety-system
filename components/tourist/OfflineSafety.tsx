'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  WifiOff, 
  DownloadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  CreditCard, 
  Battery, 
  Radio, 
  Navigation,
  HardDrive,
  RefreshCw,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const OfflineSafety: React.FC = () => {
  const { 
    tourist, 
    isOfflineMode, 
    isOfflineCached, 
    isDownloadingOffline, 
    offlineDownloadProgress, 
    downloadOfflineArea, 
    toggleOfflineMode,
    triggerSOS 
  } = useSafetyStore();

  const { digitalId } = tourist;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-white">Offline Safety Mode</h2>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              isOfflineMode 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isOfflineMode ? '● OFFLINE ACTIVE' : '● CLOUD SYNCED'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous local device intelligence for zero-connectivity zones
          </p>
        </div>

        {/* Offline Mode Toggle Button */}
        <button
          onClick={toggleOfflineMode}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
            isOfflineMode
              ? 'bg-purple-600 text-white border-purple-500 shadow-md'
              : 'bg-navy-900 text-slate-300 border-navy-700 hover:text-white'
          }`}
        >
          {isOfflineMode ? 'Reconnect Cloud' : 'Simulate Offline'}
        </button>
      </div>

      {/* Device & Sensor Offline Status Card */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-navy-950 via-purple-950/20 to-navy-950 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
            <WifiOff className="h-4 w-4 text-purple-400" />
            <span>STANDALONE HARDWARE TELEMETRY</span>
          </span>
          <span className="font-mono text-xs text-emerald-400 font-bold">STATUS: OPERATIONAL</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <span className="text-[10px] text-slate-400">NETWORK</span>
            <p className="font-bold text-purple-400">{isOfflineMode ? 'OFFLINE' : 'CONNECTED'}</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <span className="text-[10px] text-slate-400">GPS SENSOR</span>
            <p className="font-bold text-emerald-400">HARDWARE LOCKED</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <span className="text-[10px] text-slate-400">BATTERY</span>
            <p className="font-bold text-white">{tourist.batteryLevel}% (Optimized)</p>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <span className="text-[10px] text-slate-400">ZK CACHE</span>
            <p className="font-bold text-cyan-400">LOCAL SECURE ENCLAVE</p>
          </div>
        </div>
      </div>

      {/* Offline Download Card */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">DOWNLOAD SAFETY AREA</h3>
              <p className="text-xs text-slate-400">Kolkata Central Zone • 42 MB</p>
            </div>
          </div>

          {isOfflineCached && (
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              ✓ AVAILABLE OFFLINE
            </span>
          )}
        </div>

        {/* Download Progress Bar */}
        {isDownloadingOffline && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-cyan-300">
              <span className="flex items-center space-x-1">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Downloading vector tiles & emergency database...</span>
              </span>
              <span className="font-mono font-bold">{offlineDownloadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${offlineDownloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Button */}
        {!isOfflineCached && !isDownloadingOffline && (
          <button
            onClick={downloadOfflineArea}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-950 hover:from-cyan-500 hover:to-blue-500 transition"
          >
            <DownloadCloud className="h-4 w-4" />
            <span>DOWNLOAD OFFLINE PACKAGE (42 MB)</span>
          </button>
        )}

        {isOfflineCached && (
          <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Kolkata metropolitan offline zone verified in secure cache.</span>
            </div>
            <button
              onClick={downloadOfflineArea}
              className="text-[11px] underline text-cyan-400 hover:text-cyan-300"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* Available Offline Features Checklist */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          FUNCTIONS FULLY OPERATIONAL OFFLINE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Digital Tourist ID & QR Code</span>
          </div>

          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Offline Emergency Contacts & Kin</span>
          </div>

          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Cached Safety Map & Vector Layers</span>
          </div>

          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Safe Zones & Police Post Coordinates</span>
          </div>

          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">One-Touch SOS Over Cellular Mesh / SMS</span>
          </div>

          <div className="flex items-center space-x-2.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Emergency Compass & Direct Line Navigation</span>
          </div>
        </div>
      </div>

    </div>
  );
};
