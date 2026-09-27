'use client';

import React from 'react';
import { mockExternalFeeds } from '@/services/mockData';
import { Database, Activity, Radio, CloudSun, Users, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export const AuthorityDataIntelligence: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <span>Multi-Modal Data Intelligence & Telemetry Feeds</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time synchronization status across municipal CAD, weather radars & AI vision pipelines
          </p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/20">
          SIMULATED TELEMETRY FEEDS
        </span>
      </div>

      {/* External Data Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockExternalFeeds.map((feed) => {
          return (
            <div
              key={feed.id}
              className="rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-lg space-y-3 hover:border-cyan-500/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{feed.type}</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{feed.status}</span>
                </span>
              </div>

              <h3 className="font-bold text-sm text-white">{feed.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-navy-950 p-2 border border-navy-800">
                  <span className="text-[10px] text-slate-400">LATENCY</span>
                  <p className="font-mono font-bold text-cyan-300">{feed.latencyMs} ms</p>
                </div>
                <div className="rounded-xl bg-navy-950 p-2 border border-navy-800">
                  <span className="text-[10px] text-slate-400">RECORDS / MIN</span>
                  <p className="font-mono font-bold text-slate-200">{feed.recordsCount}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-navy-800">
                <span>Last Ingress:</span>
                <span className="font-mono text-slate-200">{feed.updatedAgo}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Disclaimer */}
      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 text-xs text-slate-400 space-y-1 shadow-inner">
        <div className="font-bold text-slate-200 flex items-center space-x-1.5">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>PRODUCTION ADAPTER ARCHITECTURE</span>
        </div>
        <p className="leading-relaxed">
          In production, these simulated adapters will connect to IMD radar APIs, municipal Hikvision/Dahua CCTV edge inferencing units, Kolkata Police CAD WebSocket streams, and polygon identity nodes via standardized gRPC interfaces.
        </p>
      </div>

    </div>
  );
};
