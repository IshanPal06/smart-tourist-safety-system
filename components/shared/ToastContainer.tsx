'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X, Zap } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSafetyStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSOS = toast.type === 'sos';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 fade-in duration-200 ${
              isSOS
                ? 'bg-rose-950/95 border-rose-500 text-white shadow-rose-950/60'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-slate-100 shadow-emerald-950/50'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-slate-100 shadow-amber-950/50'
                : isError
                ? 'bg-red-950/90 border-red-500/50 text-slate-100'
                : 'bg-navy-900/90 border-cyan-500/40 text-slate-100 shadow-cyan-950/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="shrink-0 mt-0.5">
                {isSOS && <AlertOctagon className="h-5 w-5 text-rose-400 animate-pulse" />}
                {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                {isWarning && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                {isError && <AlertOctagon className="h-5 w-5 text-red-400" />}
                {!isSOS && !isSuccess && !isWarning && !isError && <Zap className="h-5 w-5 text-cyan-400" />}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-bold leading-snug truncate">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
