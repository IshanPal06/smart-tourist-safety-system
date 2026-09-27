'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { Incident, IncidentStatus, RiskLevel } from '@/types';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  Radio, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { formatTimeAgo, getRiskColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const AuthorityIncidents: React.FC = () => {
  const router = useRouter();
  const { incidents, setSelectedIncidentId, dispatchResponderToIncident, resolveIncident } = useSafetyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.touristName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || inc.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleOpenResponse = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    router.push('/authority/response');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <span>Incident Command Registry</span>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-800">
              {incidents.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time incident dispatch, AI threat scoring, and resolution tracking
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, tourist, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-navy-700 bg-navy-950 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            aria-label="Filter incidents by severity"
            className="rounded-xl border border-navy-700 bg-navy-950 px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter incidents by status"
            className="rounded-xl border border-navy-700 bg-navy-950 px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Analyzing">Analyzing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Responding">Responding</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>
      </div>

      {/* Incident Table */}
      <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/90 shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-navy-800 bg-navy-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Category / Type</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Tourist ID</th>
              <th className="py-3 px-4">AI Risk Assessment</th>
              <th className="py-3 px-4">Assigned Unit</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60">
            {filteredIncidents.map((inc) => {
              const theme = getRiskColor(inc.severity);
              const isResolved = inc.status === 'Resolved';

              return (
                <tr 
                  key={inc.id}
                  className={`hover:bg-navy-800/40 transition-colors ${
                    inc.isSOS && !isResolved ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    <div className="flex items-center space-x-1.5">
                      {inc.isSOS && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
                      <span>{inc.id}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-white">
                    {inc.category}
                  </td>

                  <td className="py-3 px-4 text-slate-300 max-w-[150px] truncate" title={inc.locationName}>
                    {inc.locationName}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${theme.badge}`}>
                      {inc.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {inc.touristId}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-semibold text-cyan-200">
                        {inc.aiClassification?.priority || 'P2'} ({Math.round((inc.aiClassification?.confidence || 0.9) * 100)}%)
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {inc.assignedUnit ? (
                      <span className="font-semibold text-emerald-400">{inc.assignedUnit.callSign}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isResolved 
                        ? 'bg-slate-800 text-slate-400' 
                        : inc.status === 'Dispatched' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {inc.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenResponse(inc.id)}
                      className="rounded-lg bg-cyan-600/20 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition"
                    >
                      Response Console
                    </button>

                    {!isResolved && (
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="rounded-lg bg-emerald-600/20 px-2 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition"
                      >
                        Resolve
                      </button>
                    )}
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
