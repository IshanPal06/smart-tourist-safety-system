'use client';

import React from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, TrendingUp, Navigation, Radio } from 'lucide-react';

export const AuthorityInsights: React.FC = () => {
  const insights = [
    {
      title: 'Predictive Crowd Density Surge: Victoria Memorial',
      severity: 'MODERATE',
      timeframe: 'Next 45 - 90 Minutes',
      confidence: '94%',
      summary: 'Historical festival telemetry and metro ingress patterns indicate footfall will exceed 3,500 tourists near North Gate.',
      recommendation: 'Pre-position Tourist Safety Squad TP-01 at Eastern Gate #3 and broadcast proactive detour notifications.',
    },
    {
      title: 'Dark Alleyway Anomaly Pattern: Bowbazar & BB Ganguly St',
      severity: 'HIGH',
      timeframe: 'Immediate Advisory (Active)',
      confidence: '91%',
      summary: 'Construction barrier diversion has caused 3 isolated tourist routing queries within 30 minutes.',
      recommendation: 'Activate smart LED illumination arrays and redirect tourist edge apps to Central Avenue corridor.',
    },
    {
      title: 'Weather Precipitation & Slip Risk: Prinsep Ghat Promenades',
      severity: 'LOW',
      timeframe: 'Expected at 18:30 IST',
      confidence: '89%',
      summary: 'Localized Hooghly riverbank shower expected; ghat stairs may become slippery.',
      recommendation: 'Transmit advisory to 42 registered tourists currently inside Prinsep Ghat geofence.',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            <span>AI Risk Forecasting & Autonomous Tactical Insights</span>
          </h2>
          <p className="text-xs text-slate-400">
            Multi-modal predictive intelligence combining CCTV density, telemetry velocity & municipal CAD logs
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-navy-800 bg-navy-900/90 p-5 shadow-xl space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  insight.severity === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  insight.severity === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {insight.severity} PRIORITY
                </span>
                <h3 className="font-bold text-sm text-white">{insight.title}</h3>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>Window: <strong className="text-slate-200">{insight.timeframe}</strong></span>
                <span className="text-cyan-400 font-bold">Confidence: {insight.confidence}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {insight.summary}
            </p>

            <div className="rounded-xl bg-cyan-950/40 p-3 border border-cyan-800/40 text-xs text-cyan-200 flex items-start space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Autonomous Action Recommendation:</strong> {insight.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
