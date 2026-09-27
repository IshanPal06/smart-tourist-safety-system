'use client';

import React from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Radio, 
  Database, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Server,
  FileCheck
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="rounded-3xl border border-navy-800 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-2xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
          <ShieldCheck className="h-4 w-4" />
          <span>CRYPTOGRAPHIC PRIVACY GUARANTEE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          SAFETY WITHOUT UNNECESSARY SURVEILLANCE
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          The Smart Tourist Safety platform is architected so city authorities never receive continuous real-time tracking during normal exploration. High-precision GPS is unlocked exclusively during verified emergency distress.
        </p>
      </div>

      {/* 3 Operating Privacy Modes */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
          THREE DYNAMIC OPERATING PRIVACY MODES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="rounded-2xl border border-emerald-500/40 bg-navy-900/80 p-5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                DEFAULT STATE
              </span>
              <EyeOff className="h-5 w-5 text-emerald-400" />
            </div>
            <h4 className="font-extrabold text-sm text-white">NORMAL MODE</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Location is evaluated locally on the tourist device edge. Precise coordinates are NOT continuously exposed to authorities or logged on central servers.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/40 bg-navy-900/80 p-5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                PROACTIVE SAFETY
              </span>
              <Eye className="h-5 w-5 text-amber-400" />
            </div>
            <h4 className="font-extrabold text-sm text-white">RISK MODE</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Elevated environmental or crowd hazard detected. Autonomous local prompts display recommendations; tourist confirmation requested before escalating.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/50 bg-rose-950/20 p-5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded bg-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40 animate-pulse">
                SOS ACTIVATED
              </span>
              <Radio className="h-5 w-5 text-rose-400" />
            </div>
            <h4 className="font-extrabold text-sm text-white">EMERGENCY MODE</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              SOS triggered. High-precision live GPS stream is temporarily unsealed and shared exclusively with certified police and ambulance CAD dispatchers.
            </p>
          </div>

        </div>
      </div>

      {/* Off-Chain vs On-Chain Cryptographic Separation */}
      <div className="rounded-3xl border border-navy-800 bg-navy-950 p-6 shadow-2xl space-y-5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
          <Lock className="h-4 w-4 text-cyan-400" />
          <span>OFF-CHAIN DATA PRIVACY VS ON-CHAIN VERIFIABLE ATTESTATIONS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Off-Chain Card */}
          <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-5 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-slate-200 text-sm border-b border-navy-800 pb-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <span>DATA STORED STRICTLY OFF-CHAIN (ENCRYPTED LOCAL)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>GPS History & Routes:</strong> Cached solely on device hardware.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Personal Identification:</strong> Full passport numbers and home address.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Medical & Blood Group:</strong> Encrypted in secure device enclave.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Incident Narrative:</strong> Transmitted only over TLS 1.3 to CAD dispatch.</span>
              </li>
            </ul>
          </div>

          {/* On-Chain Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-emerald-300 text-sm border-b border-emerald-500/20 pb-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>DATA REPRESENTED ON-CHAIN (VERIFIABLE ZERO-KNOWLEDGE PROOF)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Identity Hash:</strong> Cryptographic SHA-256 Merkle root token.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Attestation Status:</strong> Binary Valid / Revoked state boolean.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cryptographic Timestamps:</strong> Block height issue & expiry proofs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Emergency Attestation Log:</strong> Immutable hash stamp of CAD dispatches.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
