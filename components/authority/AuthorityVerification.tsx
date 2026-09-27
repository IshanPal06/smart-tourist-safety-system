'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { ShieldCheck, Search, Key, Database, Cpu, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { mockTouristDensityPoints } from '@/services/mockData';

export const AuthorityVerification: React.FC = () => {
  const { tourist, verifyDigitalId } = useSafetyStore();
  const [searchId, setSearchId] = useState('ST-IND-2026-004281');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedRecord, setVerifiedRecord] = useState<any>(tourist.digitalId);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await verifyDigitalId();
      setVerifiedRecord(tourist.digitalId);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span>Zero-Knowledge Digital Identity Attestation Registry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Gov-Polygon Private Safety Subnet (ID: 80002) • Verifiable Credentials Engine
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Digital Tourist ID (e.g. ST-IND-2026-004281)..."
            className="w-full rounded-xl border border-navy-700 bg-navy-900 pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isVerifying}
          className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-950 transition hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50"
        >
          {isVerifying ? 'VERIFYING...' : 'VERIFY IDENTITY PROOF'}
        </button>
      </form>

      {/* Verified ID Details Card */}
      {verifiedRecord && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-navy-950 to-navy-900 p-6 shadow-2xl space-y-4">
          
          <div className="flex items-start justify-between border-b border-navy-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-black text-cyan-300">{verifiedRecord.idNumber}</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  ● MERKLE PROOF VALIDATED
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                Holder: {verifiedRecord.holderName} ({verifiedRecord.nationality})
              </h3>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Network:</span>
              <p className="font-mono text-cyan-400">{verifiedRecord.blockchainNetwork}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">ISSUANCE DATE</span>
              <p className="font-bold text-slate-100">{verifiedRecord.issueDate}</p>
            </div>
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">EXPIRATION</span>
              <p className="font-bold text-slate-100">{verifiedRecord.expiryDate}</p>
            </div>
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">BLOCK HEIGHT</span>
              <p className="font-mono font-bold text-emerald-400">#{verifiedRecord.blockNumber}</p>
            </div>
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800">
              <span className="text-[10px] text-slate-400">BLOOD GROUP</span>
              <p className="font-bold text-white">{verifiedRecord.bloodGroup}</p>
            </div>
          </div>

          <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>On-Chain Cryptographic Identity Hash:</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">Zero-Knowledge Groth16 Snark Proof</span>
            </div>
            <p className="font-mono text-cyan-300 text-[11px] truncate">
              {verifiedRecord.identityHash}
            </p>
          </div>

        </div>
      )}

      {/* Simulated Tourist ID Registry Samples */}
      <div className="rounded-2xl border border-navy-800 bg-navy-900/70 p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          RECENTLY ATTESTED TOURIST PASSES (DEMO CLUSTERS)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {mockTouristDensityPoints.slice(0, 6).map((t, idx) => (
            <div key={t.id} className="rounded-xl bg-navy-950 p-2.5 border border-navy-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">{t.name}</span>
                <p className="text-[10px] text-slate-400">{t.nationality} • Score: {t.safetyScore}/100</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800">
                VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
