'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  ShieldCheck, 
  QrCode, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Database, 
  Eye, 
  EyeOff, 
  Key, 
  Radio, 
  Cpu,
  Layers
} from 'lucide-react';

export const DigitalTouristID: React.FC = () => {
  const { tourist, verifyDigitalId } = useSafetyStore();
  const { digitalId } = tourist;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      await verifyDigitalId();
      setVerificationResult({
        status: 'VERIFIED',
        network: digitalId.blockchainNetwork,
        block: digitalId.blockNumber,
        hash: digitalId.identityHash,
        proof: 'Zero-Knowledge Groth16 Snark Proof',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <span>Digital Tourist ID</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              ● VERIFIED
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Zero-Knowledge Verifiable Credential • Gov-Safety Subnet
          </p>
        </div>
      </div>

      {/* Official Government Digital ID Card */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 shadow-2xl shadow-cyan-950/40">
        
        {/* Card Holographic Watermark Accents */}
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />

        {/* Top Card Header */}
        <div className="flex items-start justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black shadow-md">
              IN
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                GOVERNMENT OF INDIA • MIN. OF TOURISM
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                SMART TOURIST IDENTITY PASS
              </h3>
            </div>
          </div>
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
        </div>

        {/* Card Body */}
        <div className="my-4 grid grid-cols-3 gap-4">
          
          {/* QR Code Mockup */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-white p-2.5 shadow-inner">
            <div className="h-20 w-20 flex flex-col items-center justify-center border-2 border-slate-900 rounded p-1 space-y-1">
              <QrCode className="h-16 w-16 text-slate-950" />
            </div>
            <span className="mt-1 font-mono text-[8px] font-bold text-slate-700">SCAN TO VERIFY</span>
          </div>

          {/* Holder Details */}
          <div className="col-span-2 space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium">HOLDER NAME</span>
              <p className="font-extrabold text-white text-sm">{digitalId.holderName}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400">ID NUMBER</span>
                <p className="font-mono font-bold text-cyan-300">{digitalId.idNumber}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">NATIONALITY</span>
                <p className="font-bold text-slate-200">{digitalId.nationality}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400">ISSUED</span>
                <p className="text-slate-300">{digitalId.issueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">VALID UNTIL</span>
                <p className="text-slate-300">{digitalId.expiryDate}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Cryptographic Hash Footer */}
        <div className="rounded-xl bg-navy-950/80 p-2.5 border border-navy-800 text-[10px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1">
              <Lock className="h-3 w-3 text-cyan-400" />
              <span>Identity Hash (ZK-Proof):</span>
            </span>
            <span className="text-emerald-400 font-bold">STATUS: ACTIVE</span>
          </div>
          <div className="font-mono text-cyan-400 truncate">
            {digitalId.identityHash}
          </div>
        </div>

        {/* Verification Trigger Button */}
        <div className="mt-4">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-950/50 hover:from-cyan-500 hover:to-blue-500 transition disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-200" />
                <span>VALIDATING ON-CHAIN MERKLE PROOF...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <span>VERIFY DIGITAL ID (ZK-PROOF)</span>
              </>
            )}
          </button>
        </div>

        {/* Verification Success Result */}
        {verificationResult && (
          <div className="mt-3 rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 animate-in fade-in">
            <div className="flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>IDENTITY HASH VERIFIED ON PRIVATE GOV-SUBNET</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              Network: {verificationResult.network} • Block #{verificationResult.block}
            </div>
          </div>
        )}

      </div>

      {/* Visible Privacy & Cryptographic Architecture Model */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 space-y-4">
        <div className="flex items-center space-x-2 border-b border-navy-800 pb-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            PRIVACY GUARANTEE & ARCHITECTURE MODEL
          </h3>
        </div>

        {/* 3 Operating Modes */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-navy-900/90 p-2.5 border border-emerald-500/20 space-y-1">
            <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
              <EyeOff className="h-3.5 w-3.5" />
              <span>NORMAL MODE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Autonomous edge safety. Precise location is NOT continuously shared with authorities.
            </p>
          </div>

          <div className="rounded-xl bg-navy-900/90 p-2.5 border border-amber-500/20 space-y-1">
            <div className="flex items-center space-x-1 text-amber-400 font-bold text-[11px]">
              <Eye className="h-3.5 w-3.5" />
              <span>RISK MODE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Elevated risk zone detected. Local safety prompts appear for tourist confirmation.
            </p>
          </div>

          <div className="rounded-xl bg-navy-900/90 p-2.5 border border-rose-500/20 space-y-1">
            <div className="flex items-center space-x-1 text-rose-400 font-bold text-[11px]">
              <Radio className="h-3.5 w-3.5" />
              <span>EMERGENCY MODE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              SOS activated. High-resolution GPS stream unlocked exclusively for responders.
            </p>
          </div>
        </div>

        {/* Off-Chain vs On-Chain Storage Separation */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-200">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>OFF-CHAIN (Encrypted Local)</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Full Passport & Visa details</li>
              <li>GPS Historical Telemetry</li>
              <li>Incident Descriptions & Notes</li>
              <li>Medical & Emergency Contacts</li>
            </ul>
          </div>

          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-200">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>ON-CHAIN (Verifiable Proof)</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Zero-Knowledge Identity Hash</li>
              <li>Verification Attestation Status</li>
              <li>Cryptographic Timestamps</li>
              <li>Revocation Registry Status</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
