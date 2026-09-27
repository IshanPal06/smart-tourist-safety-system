'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AuthorityAnalytics: React.FC = () => {
  
  // Incidents by category data
  const incidentCategoryData = [
    { name: 'Theft', count: 12 },
    { name: 'Medical', count: 9 },
    { name: 'Suspicious', count: 14 },
    { name: 'Harassment', count: 6 },
    { name: 'Lost Tourist', count: 8 },
    { name: 'Construction/Hazard', count: 5 },
  ];

  // Hourly Crowd Density & Alert Trend (24h)
  const hourlyTrendData = [
    { time: '10:00', tourists: 840, riskAlerts: 4, avgScore: 88 },
    { time: '12:00', tourists: 1200, riskAlerts: 8, avgScore: 84 },
    { time: '14:00', tourists: 1450, riskAlerts: 11, avgScore: 81 },
    { time: '16:00', tourists: 1842, riskAlerts: 14, avgScore: 78 },
    { time: '18:00', tourists: 2100, riskAlerts: 19, avgScore: 74 },
    { time: '20:00', tourists: 1650, riskAlerts: 12, avgScore: 79 },
    { time: '22:00', tourists: 920, riskAlerts: 5, avgScore: 85 },
  ];

  // Response Time Distribution
  const responseTimeData = [
    { range: '< 2 min', count: 18, color: '#10b981' },
    { range: '2 - 4 min', count: 24, color: '#06b6d4' },
    { range: '4 - 6 min', count: 8, color: '#f59e0b' },
    { range: '> 6 min', count: 2, color: '#ef4444' },
  ];

  const PIE_COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span>AI Risk Analytics & Tactical Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Predictive crowd velocity, dispatch latency benchmarks & spatial incident density
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
          AVG RESPONSE ETA: 3.2 MIN
        </span>
      </div>

      {/* Top 3 KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DISPATCH EFFICIENCY</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">96.4%</div>
          <p className="text-[11px] text-emerald-400 font-semibold">▲ +4.2% faster than municipal SLA</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PREDICTIVE ACCURACY</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">93.8%</div>
          <p className="text-[11px] text-slate-300">AI geofence breach pre-warning rate</p>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>INCIDENTS MITIGATED</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">142</div>
          <p className="text-[11px] text-slate-300">Resolved within safety bubble perimeter</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Chart 1: Hourly Density & Risk Alerts */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            HOURLY TOURIST FOOTFALL VS RISK ALERTS
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrendData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1738', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="tourists" name="Active Tourists" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="riskAlerts" name="Risk Alerts" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Category */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            INCIDENT DISTRIBUTION BY CATEGORY
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentCategoryData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1738', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Reported Incidents" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
