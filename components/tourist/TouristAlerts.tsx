'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { SafetyAlert, RiskLevel } from '@/types';
import { 
  Bell, 
  CloudRain, 
  Users, 
  ShieldAlert, 
  Radio, 
  CheckCircle, 
  Info, 
  MapPin, 
  Clock, 
  CheckCheck,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatTimeAgo, getRiskColor } from '@/lib/utils';

export const TouristAlerts: React.FC = () => {
  const { alerts, markAlertRead } = useSafetyStore();
  const [filterType, setFilterType] = useState<string>('All');

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'All') return true;
    if (filterType === 'Critical') return alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
    if (filterType === 'Safety') return alert.type === 'Geofence' || alert.type === 'Incident';
    if (filterType === 'Weather') return alert.type === 'Weather';
    if (filterType === 'Crowd') return alert.type === 'Crowd';
    if (filterType === 'System') return alert.type === 'System';
    return true;
  });

  const alertsNow = filteredAlerts.filter(a => a.timeGroup === 'NOW' || (!a.timeGroup && !a.read));
  const alertsEarlier = filteredAlerts.filter(a => a.timeGroup === 'EARLIER TODAY' || (!a.timeGroup && a.read));
  const alertsResolved = filteredAlerts.filter(a => a.timeGroup === 'RESOLVED');

  const getAlertIcon = (type: SafetyAlert['type']) => {
    switch (type) {
      case 'Weather':
        return <CloudRain className="h-5 w-5 text-sky-400" />;
      case 'Crowd':
        return <Users className="h-5 w-5 text-amber-400" />;
      case 'Geofence':
        return <ShieldAlert className="h-5 w-5 text-orange-400" />;
      case 'Emergency':
        return <Radio className="h-5 w-5 text-rose-500 animate-pulse" />;
      case 'Incident':
        return <Radio className="h-5 w-5 text-rose-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  const renderAlertCard = (alert: SafetyAlert) => {
    const riskTheme = getRiskColor(alert.severity);

    return (
      <div
        key={alert.id}
        onClick={() => markAlertRead(alert.id)}
        className={`relative overflow-hidden rounded-2xl border p-4 transition-all cursor-pointer ${
          !alert.read
            ? 'border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-lg hover:scale-[1.01]'
            : 'border-navy-800 bg-navy-950/70 opacity-80 hover:opacity-100'
        }`}
      >
        {!alert.read && (
          <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
        )}

        <div className="flex items-start space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 border border-navy-800">
            {getAlertIcon(alert.type)}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${riskTheme.badge}`}>
                  {alert.severity}
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {alert.title}
                </span>
              </div>
              <span className="flex items-center space-x-1 text-[10px] text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(alert.timestamp)}</span>
              </span>
            </div>

            <p className="text-xs font-medium text-slate-200">
              {alert.message}
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>{alert.location}</span>
              </span>
            </div>

            <div className="mt-2 rounded-lg bg-navy-900/90 p-2 text-xs border border-navy-800/80 text-cyan-300">
              <strong>Recommended Action:</strong> {alert.recommendedAction}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <span>Safety Alerts & Advisories</span>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-800">
              {alerts.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Categorized environmental, crowd, incident and system notifications
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {['All', 'Critical', 'Safety', 'Weather', 'Crowd', 'System'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                filterType === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-navy-950 text-slate-400 border border-navy-800 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Group: NOW */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 border-b border-navy-800 pb-1">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>NOW (ACTIVE ADVISORIES)</span>
        </div>
        {alertsNow.length > 0 ? (
          alertsNow.map(renderAlertCard)
        ) : (
          <div className="rounded-xl border border-navy-800 bg-navy-950/60 p-3 text-xs text-slate-400 text-center">
            No active urgent alerts at this moment.
          </div>
        )}
      </div>

      {/* Group: EARLIER TODAY */}
      {alertsEarlier.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 border-b border-navy-800 pb-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>EARLIER TODAY</span>
          </div>
          {alertsEarlier.map(renderAlertCard)}
        </div>
      )}

      {/* Group: RESOLVED */}
      {alertsResolved.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 border-b border-navy-800 pb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>RESOLVED & ATTESTED</span>
          </div>
          {alertsResolved.map(renderAlertCard)}
        </div>
      )}

    </div>
  );
};
