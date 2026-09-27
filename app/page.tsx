'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Radio, 
  Play, 
  MapPin, 
  Sparkles, 
  Lock, 
  Cpu, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  PhoneCall,
  Zap,
  WifiOff,
  BellRing,
  Layers,
  Search,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useSafetyStore } from '@/store/safetyStore';

export default function LandingPage() {
  const { startDemo, setActiveRole } = useSafetyStore();

  const protectionLayers = [
    {
      title: 'Predictive Safety',
      desc: 'AI continuously evaluates environmental and location risk before hazards materialize.',
      icon: Cpu,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: 'Intelligent Alerts',
      desc: 'Proactive warnings dispatched before a situation escalates into a critical emergency.',
      icon: BellRing,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      title: 'Emergency Response',
      desc: 'One-touch SOS connects tourists directly to verified local patrol units and ambulances.',
      icon: PhoneCall,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      title: 'Digital Identity',
      desc: 'Privacy-preserving zero-knowledge verification keeping personal data strictly off-chain.',
      icon: Lock,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'Command Center',
      desc: 'Municipal authorities gain sub-second situational awareness and automated CAD dispatch.',
      icon: Radio,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      title: 'Offline Safety',
      desc: 'Essential safety functionality, maps and credentials remain available with zero internet.',
      icon: WifiOff,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'DETECT',
      desc: 'Collects simulated signals from GPS, weather radar, vision AI crowd density, incident reports, and geofences.',
      icon: Eye,
    },
    {
      step: '02',
      title: 'ANALYZE',
      desc: 'Edge AI risk engine evaluates multi-variate environmental factors and spatial incident proximity.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'PREDICT',
      desc: 'Identifies emerging risks, construction hazards, crowd surges, and unlit corridor anomalies.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'ALERT',
      desc: 'Tourist receives contextual safety guidance, green bypass rerouting, and proactive notifications.',
      icon: BellRing,
    },
    {
      step: '05',
      title: 'RESPOND',
      desc: 'One-touch SOS or incident filing initiates instant triage, ZK-identity check, and responder matching.',
      icon: Zap,
    },
    {
      step: '06',
      title: 'RESOLVE',
      desc: 'Kolkata EOC Command Center coordinates on-scene units, escorting tourists safely to their destination.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141f4d15_1px,transparent_1px),linear-gradient(to_bottom,#141f4d15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8">
        
        {/* System Status Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8">
          <div className="flex items-center space-x-1.5 rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-navy-700 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI ENGINE — ONLINE</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-navy-700 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GEOFENCING — ACTIVE</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-navy-700 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EMERGENCY NETWORK — CONNECTED</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-navy-700 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DIGITAL ID — VERIFIED</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Explore freely. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Stay protected intelligently.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            “AI-powered safety intelligence connecting tourists, emergency services and city authorities.”
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          
          <button
            onClick={() => startDemo()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-cyan-950 hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
            <span>LAUNCH INTERACTIVE DEMO</span>
          </button>

          <Link
            href="/tourist"
            onClick={() => setActiveRole('tourist')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-2xl bg-navy-900 px-8 py-4 text-sm font-black text-slate-200 border border-navy-700 hover:bg-navy-800 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>EXPLORE THE PLATFORM</span>
          </Link>

        </div>

        {/* Hero Visualization Flow Diagram */}
        <div className="mt-16 rounded-3xl border border-navy-800 bg-navy-900/60 p-6 shadow-2xl backdrop-blur-md">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-cyan-400 mb-6 flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>CONNECTED SMART CITY SAFETY ECOSYSTEM</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            
            <div className="rounded-2xl bg-navy-950/90 p-4 border border-navy-800 space-y-2 hover:border-cyan-500/40 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Tourist</h4>
              <p className="text-[11px] text-slate-400">Mobile companion & 180m safety bubble</p>
            </div>

            <div className="rounded-2xl bg-navy-950/90 p-4 border border-navy-800 space-y-2 hover:border-blue-500/40 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mx-auto">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white">AI Risk Engine</h4>
              <p className="text-[11px] text-slate-400">Continuous threat scoring & safe routing</p>
            </div>

            <div className="rounded-2xl bg-navy-950/90 p-4 border border-navy-800 space-y-2 hover:border-amber-500/40 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mx-auto">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Geofencing</h4>
              <p className="text-[11px] text-slate-400">Autonomous polygon hazard boundaries</p>
            </div>

            <div className="rounded-2xl bg-navy-950/90 p-4 border border-navy-800 space-y-2 hover:border-rose-500/40 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 mx-auto">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Emergency Response</h4>
              <p className="text-[11px] text-slate-400">One-touch SOS & rapid unit dispatch</p>
            </div>

            <div className="rounded-2xl bg-navy-950/90 p-4 border border-navy-800 space-y-2 col-span-2 md:col-span-1 hover:border-emerald-500/40 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto">
                <Radio className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Command Center</h4>
              <p className="text-[11px] text-slate-400">Municipal situational awareness</p>
            </div>

          </div>
        </div>

        {/* Section: One platform. Multiple layers of protection */}
        <div className="mt-24 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              LAYERED DEFENSE IN DEPTH
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              One platform. <br className="sm:hidden" />
              Multiple layers of protection.
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Engineered to safeguard visitors across every phase of urban exploration while honoring strict digital privacy standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {protectionLayers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-navy-800 bg-navy-900/40 p-6 space-y-3 hover:border-navy-700 transition"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${layer.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{layer.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {layer.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: How It Works */}
        <div className="mt-24 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              SYSTEM LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How the Safety Engine Operates
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              From continuous ambient detection to coordinated emergency resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 space-y-2 hover:border-cyan-500/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {item.step}
                    </span>
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
