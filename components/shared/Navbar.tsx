'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Radio, Activity, AlertTriangle, Play, RefreshCw, Zap, Lock } from 'lucide-react';
import { useSafetyStore } from '@/store/safetyStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { 
    tourist, 
    incidents, 
    activeRole, 
    setActiveRole, 
    startDemo, 
    demo, 
    resetDemo 
  } = useSafetyStore();

  const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;
  const isEmergency = tourist.sosActive;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-800 bg-navy-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Platform Name */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
              {isEmergency && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                  SMART TOURIST SAFETY
                </span>
                <span className="hidden rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/50 md:inline-block">
                  v2.6 GOVTECH
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                Smart City Kolkata • Incident Response & AI Risk Shield
              </p>
            </div>
          </Link>

          {/* Demonstration Only Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 border border-amber-500/20 text-[11px] font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>SIMULATED DEMO DATA</span>
          </div>
        </div>

        {/* Center: Live Demo CTA */}
        <div className="flex items-center space-x-2">
          {!demo.isPlaying ? (
            <button
              onClick={() => {
                startDemo();
              }}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span className="font-bold tracking-wide">▶ RUN SAFETY INCIDENT DEMO</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 rounded-md bg-cyan-900/50 px-2.5 py-1 text-xs text-cyan-300 border border-cyan-600/40">
                <Zap className="h-3 w-3 text-cyan-400 animate-bounce" />
                <span className="font-mono font-medium">STEP {demo.currentStep}/14</span>
              </span>
              <button
                onClick={resetDemo}
                title="Reset simulation"
                className="rounded-md bg-navy-800 p-1.5 text-slate-400 hover:text-white hover:bg-navy-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Navigation & Role Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Active Incidents Alert Indicator */}
          {activeIncidentsCount > 0 && (
            <Link
              href="/authority/incidents"
              className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              <span>{activeIncidentsCount} Active</span>
            </Link>
          )}

          {/* Role Switcher Pill */}
          <div className="flex items-center rounded-xl bg-navy-900 p-1 border border-navy-700/80 shadow-inner">
            <Link
              href="/tourist"
              onClick={() => setActiveRole('tourist')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                pathname.startsWith('/tourist') || activeRole === 'tourist'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Tourist</span>
              {isEmergency && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </Link>

            <Link
              href="/authority"
              onClick={() => setActiveRole('authority')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                pathname.startsWith('/authority') || activeRole === 'authority'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Safety Authority</span>
              <span className="sm:hidden">Authority</span>
            </Link>
          </div>

        </div>

      </div>
    </header>
  );
};
