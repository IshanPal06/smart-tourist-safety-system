'use client';

import React from 'react';
import Link from 'next/link';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Shield, 
  Radio, 
  Sparkles,
  MapPin,
  ChevronRight,
  AlertOctagon,
  Clock,
  Activity,
  BarChart3,
  FileCheck
} from 'lucide-react';
import { PresenterControlPanel } from '@/components/demo/PresenterControlPanel';

export default function DemoPage() {
  const { demo, startDemo, pauseDemo, resumeDemo, resetDemo, setDemoStep, tourist, incidents } = useSafetyStore();

  const isCompleted = demo.currentStep === 15;

  const demoStepsList = [
    { num: 1, title: 'Tourist enters caution zone', role: 'Tourist', desc: 'Tourist enters Bowbazar Construction Corridor boundary.' },
    { num: 2, title: 'Safety score falls (82 → 72)', role: 'AI Engine', desc: 'Real-time score recalculation factoring in hazard & lighting.' },
    { num: 3, title: 'Geofence alert appears', role: 'Tourist Device', desc: 'Autonomous trigger displays elevated-risk modal prompt.' },
    { num: 4, title: 'AI recommends alternate route', role: 'AI Route Shield', desc: 'Safe bypass generated avoiding unlit construction lanes.' },
    { num: 5, title: 'Incident occurs', role: 'Environment', desc: 'Tourist encounters acute medical distress / confrontation.' },
    { num: 6, title: 'SOS activated', role: 'Tourist App', desc: 'One-touch SOS initiates emergency protocol.' },
    { num: 7, title: 'Digital ID verified', role: 'Gov-Subnet Node', desc: 'Cryptographic ZK-proof validates ST-IND-2026-004281.' },
    { num: 8, title: 'Precise location shared', role: 'Privacy Shield', desc: 'High-precision GPS telemetry unlocked for responders only.' },
    { num: 9, title: 'AI classifies incident', role: 'AI Threat Triage', desc: 'Classified as Priority P1 Emergency (Confidence 99%).' },
    { num: 10, title: 'Authority receives incident', role: 'Command Center', desc: 'EOC Command Center flashes critical incident banner and alert.' },
    { num: 11, title: 'Nearest responder selected', role: 'Dispatch Engine', desc: 'Police Response Unit P-17 selected (0.35 km, ETA 2 min).' },
    { num: 12, title: 'Responder dispatched', role: 'EOC Dispatcher', desc: 'CAD approves response. Unit P-17 status switches to Dispatched.' },
    { num: 13, title: 'Tourist receives response status', role: 'Tourist Mobile', desc: 'Tourist sees live responder callsign, ETA countdown and contact.' },
    { num: 14, title: 'Incident resolved', role: 'Field & EOC', desc: 'Threat neutralized, tourist safely escorted to hotel.' },
    { num: 15, title: 'Audit trail created', role: 'Blockchain & CAD', desc: 'Immutable cryptographic CAD audit record recorded.' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Top Header Card */}
        <div className="rounded-3xl border border-navy-800 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  AUTOMATED DEMONSTRATION MODE
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  15-Step Incident Lifecycle Simulator
                </h1>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center space-x-2">
              {!demo.isPlaying ? (
                <button
                  onClick={startDemo}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-black text-white shadow-xl shadow-cyan-950 hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>▶ START SIMULATION</span>
                </button>
              ) : demo.isPaused ? (
                <button
                  onClick={resumeDemo}
                  className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-black text-white shadow-xl shadow-emerald-950 hover:bg-emerald-500 transition"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>RESUME</span>
                </button>
              ) : (
                <button
                  onClick={pauseDemo}
                  className="flex items-center space-x-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-black text-slate-950 shadow-xl shadow-amber-950 hover:bg-amber-400 transition"
                >
                  <Pause className="h-4 w-4 fill-current" />
                  <span>PAUSE</span>
                </button>
              )}

              <button
                onClick={resetDemo}
                className="flex items-center space-x-1.5 rounded-xl bg-navy-800 px-4 py-3 text-xs font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 hover:text-white transition"
              >
                <RotateCcw className="h-4 w-4" />
                <span>RESET</span>
              </button>
            </div>
          </div>

          {/* Scenario Overview Card */}
          <div className="rounded-2xl bg-navy-950/80 p-4 border border-navy-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">DEMO SCENARIO</span>
              <p className="font-bold text-slate-100">Park Street → Esplanade</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">INCIDENT TYPE</span>
              <p className="font-bold text-rose-400">Simulated Medical Emergency / SOS</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">TOURIST ID</span>
              <p className="font-mono font-bold text-cyan-300">ST-IND-2026-004281 (Alex)</p>
            </div>
          </div>

          {/* Dual View Navigators */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/tourist"
              className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-cyan-950/40 transition"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Open Tourist Mobile View</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/authority"
              className="flex items-center justify-between rounded-xl bg-navy-950 p-3 border border-blue-500/30 text-xs font-bold text-blue-300 hover:bg-blue-950/40 transition"
            >
              <div className="flex items-center space-x-2">
                <Radio className="h-4 w-4" />
                <span>Open Authority Command Center</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Completion Card when Step 15 reached */}
        {isCompleted && (
          <div className="rounded-3xl border border-emerald-500/50 bg-gradient-to-r from-navy-950 via-emerald-950/30 to-navy-950 p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 border-b border-navy-800 pb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  SIMULATION COMPLETE
                </span>
                <h2 className="text-2xl font-black text-white">
                  TOURIST SAFELY GUIDED
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800">
                <span className="text-[10px] text-slate-400">TOTAL RESPONSE TIME</span>
                <p className="font-mono text-xl font-black text-emerald-400">4m 18s</p>
              </div>

              <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800">
                <span className="text-[10px] text-slate-400">AI CONFIDENCE</span>
                <p className="font-mono text-xl font-black text-cyan-400">94%</p>
              </div>

              <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800">
                <span className="text-[10px] text-slate-400">PRIMARY RESPONDER</span>
                <p className="font-bold text-white text-base">Unit P-17</p>
              </div>

              <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800">
                <span className="text-[10px] text-slate-400">FINAL STATUS</span>
                <p className="font-bold text-emerald-400 text-base">RESOLVED</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={startDemo}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg"
              >
                <RotateCcw className="h-4 w-4" />
                <span>REPLAY DEMO</span>
              </button>

              <Link
                href="/authority/incidents"
                className="flex items-center space-x-1.5 rounded-xl bg-navy-800 px-5 py-3 text-xs font-bold text-slate-200 border border-navy-700 hover:bg-navy-700"
              >
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>VIEW INCIDENT IN CAD</span>
              </Link>

              <Link
                href="/authority/analytics"
                className="flex items-center space-x-1.5 rounded-xl bg-navy-800 px-5 py-3 text-xs font-bold text-slate-200 border border-navy-700 hover:bg-navy-700"
              >
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span>VIEW ANALYTICS</span>
              </Link>
            </div>
          </div>
        )}

        {/* Presenter Control Panel */}
        <PresenterControlPanel />

        {/* 15 Steps Interactive Timeline */}
        <div className="rounded-3xl border border-navy-800 bg-navy-900/60 p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            15-STEP INCIDENT LIFECYCLE SEQUENCE
          </h3>

          <div className="space-y-2">
            {demoStepsList.map((step) => {
              const isCurrent = demo.currentStep === step.num;
              const isPast = demo.currentStep > step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => setDemoStep(step.num)}
                  className={`flex items-start justify-between rounded-2xl p-3 border transition cursor-pointer ${
                    isCurrent
                      ? 'border-cyan-500 bg-gradient-to-r from-navy-950 via-cyan-950/40 to-navy-950 shadow-lg shadow-cyan-950/50'
                      : isPast
                      ? 'border-emerald-500/30 bg-navy-950/80 opacity-90'
                      : 'border-navy-800 bg-navy-950/40 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 animate-pulse'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-navy-900 text-slate-500 border border-navy-800'
                    }`}>
                      {isPast ? '✓' : step.num}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{step.title}</span>
                        <span className="rounded bg-navy-900 px-1.5 py-0.2 text-[9px] font-mono text-slate-400 border border-navy-800">
                          {step.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{step.desc}</p>
                    </div>
                  </div>

                  <span className="text-xs text-cyan-400 font-bold shrink-0">
                    {isCurrent ? 'ACTIVE NOW' : isPast ? 'COMPLETED' : 'JUMP →'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
