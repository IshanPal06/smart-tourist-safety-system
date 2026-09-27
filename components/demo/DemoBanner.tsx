'use client';

import React, { useEffect } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { demo, setDemoStep, pauseDemo, resumeDemo, resetDemo, startDemo } = useSafetyStore();

  // Automatic step timer when demo is playing and not paused
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (demo.isPlaying && !demo.isPaused && demo.currentStep > 0 && demo.currentStep < demo.totalSteps) {
      timer = setTimeout(() => {
        setDemoStep(demo.currentStep + 1);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [demo.isPlaying, demo.isPaused, demo.currentStep, demo.totalSteps, setDemoStep]);

  if (!demo.isPlaying && demo.currentStep === 0) {
    return null;
  }

  const isCompleted = demo.currentStep === demo.totalSteps;

  return (
    <aside aria-label="Demo Simulation Controller" className="sticky top-16 z-40 w-full border-b border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-xl shadow-cyan-950/20 px-4 py-2.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        
        {/* Left: Step Indicator & Story Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300 border border-cyan-700/50">
                STEP {demo.currentStep} OF {demo.totalSteps}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {demo.stepMessage}
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {demo.stepDetails}
            </p>
          </div>
        </div>

        {/* Right: Demo Controls */}
        <div className="flex items-center space-x-2">
          {/* Step Back */}
          <button
            onClick={() => setDemoStep(Math.max(1, demo.currentStep - 1))}
            disabled={demo.currentStep <= 1}
            className="rounded-lg bg-navy-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Previous Step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Play / Pause */}
          {demo.isPaused ? (
            <button
              onClick={resumeDemo}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-600/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40 transition"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={pauseDemo}
              disabled={isCompleted}
              className="flex items-center space-x-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 disabled:opacity-40 transition"
            >
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={() => setDemoStep(Math.min(demo.totalSteps, demo.currentStep + 1))}
            disabled={demo.currentStep >= demo.totalSteps}
            className="rounded-lg bg-navy-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Next Step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Reset / Replay */}
          <button
            onClick={resetDemo}
            className="flex items-center space-x-1.5 rounded-lg bg-navy-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-navy-700 hover:bg-navy-700 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>

      {/* Progress Line */}
      <div className="mt-2 h-1 w-full bg-navy-950 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${(demo.currentStep / demo.totalSteps) * 100}%` }}
        />
      </div>
    </aside>
  );
};
