'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { mockTouristMonitoringRows } from '@/services/mockData';
import { Users, Lock, Shield, EyeOff, Radio, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { getRiskColor } from '@/lib/utils';

export const AuthorityTourists: React.FC = () => {
  const { tourist } = useSafetyStore();
  const [search, setSearch] = useState('');

  const allRows = [
    {
      id: tourist.digitalId.idNumber,
      risk: tourist.safetyScore.riskLevel,
      zone: tourist.currentLocation.name,
      lastEvent: tourist.sosActive ? '🚨 EMERGENCY SOS' : 'Active Safe Route',
      sos: tourist.sosActive ? 'YES' : 'No',
      idStatus: 'Verified',
      lat: tourist.currentLocation.lat,
      lng: tourist.currentLocation.lng,
    },
    ...mockTouristMonitoringRows
  ];

  const filtered = allRows.filter(r => 
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.zone.toLowerCase().includes(search.toLowerCase()) ||
    r.risk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <span>Anonymized Tourist Safety Monitoring</span>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-800">
              1,842 Active Edge Nodes
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry aggregation with strict zero-knowledge privacy protection
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by ID, zone, risk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-navy-700 bg-navy-950 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Privacy Guarantee Indicator Banner */}
      <div className="flex items-center space-x-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300">
        <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold">PRIVACY-SAFE AGGREGATION PROTOCOL:</span>
          <p className="text-[11px] text-slate-300">
            Precise location access is restricted on edge unless emergency SOS or risk escalation is actively triggered by the visitor.
          </p>
        </div>
      </div>

      {/* Anonymized Tourist Table */}
      <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/90 shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-navy-800 bg-navy-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Tourist ID</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Safety Zone / Corridor</th>
              <th className="py-3 px-4">Last Event</th>
              <th className="py-3 px-4">SOS Active</th>
              <th className="py-3 px-4">Digital ID Status</th>
              <th className="py-3 px-4 text-right">Attestation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60">
            {filtered.map((row, idx) => {
              const isSOS = row.sos === 'YES';
              const riskLevel = row.risk.toUpperCase() as any;
              const theme = getRiskColor(riskLevel);

              return (
                <tr 
                  key={idx}
                  className={`hover:bg-navy-800/40 transition-colors ${
                    isSOS ? 'bg-rose-950/20 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    <div className="flex items-center space-x-1.5">
                      {isSOS && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
                      <span>{row.id}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badge}`}>
                      {row.risk}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {row.zone}
                  </td>

                  <td className="py-3 px-4 text-slate-200">
                    {row.lastEvent}
                  </td>

                  <td className="py-3 px-4">
                    {isSOS ? (
                      <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white animate-pulse">
                        YES (DISPATCH)
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                      ● Verified
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="font-mono text-[10px] text-slate-400">Gov-Polygon</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
