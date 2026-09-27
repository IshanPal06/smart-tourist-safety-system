'use client';

import React from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { ShieldCheck, Clock, FileCheck, Lock, Radio, AlertOctagon, CheckCircle2, Search } from 'lucide-react';

export const AuthorityAuditTrail: React.FC = () => {
  const { auditEvents } = useSafetyStore();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-cyan-400" />
            <span>Immutable System Audit Trail & CAD Incident Log</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically signed record of every SOS trigger, CAD dispatch and ID verification
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
          GOV-SUBNET ATTESTED
        </span>
      </div>

      {/* Audit Events Feed */}
      <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>EVENT & CAD TELEMETRY</span>
          <span>TIMESTAMP (IST)</span>
        </div>

        <div className="space-y-3">
          {auditEvents.map((item) => {
            return (
              <div
                key={item.id}
                className="rounded-xl border border-navy-800 bg-navy-950/80 p-3.5 space-y-1.5 hover:border-cyan-500/30 transition text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400 font-bold">{item.id}</span>
                    <span className="rounded bg-navy-900 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-navy-800">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-100">{item.event}</h4>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.timestamp}</span>
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-navy-900 text-[10px] text-slate-400">
                  <span>Actor / Node: <strong className="text-slate-200">{item.actor}</strong></span>
                  {item.txHash && (
                    <span className="font-mono text-cyan-400">Attestation Hash: {item.txHash}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
