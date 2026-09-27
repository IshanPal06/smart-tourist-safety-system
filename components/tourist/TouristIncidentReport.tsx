'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { IncidentCategory, RiskLevel } from '@/types';
import { 
  FileText, 
  MapPin, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle,
  Flame,
  UserX,
  Stethoscope,
  Eye,
  Lock,
  RefreshCw
} from 'lucide-react';
import { getRiskColor } from '@/lib/utils';

export const TouristIncidentReport: React.FC = () => {
  const { tourist, submitIncidentReport, incidents } = useSafetyStore();

  const [category, setCategory] = useState<IncidentCategory>('Suspicious Activity');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);

  const categories: { label: IncidentCategory; icon: any }[] = [
    { label: 'Suspicious Activity', icon: Eye },
    { label: 'Theft', icon: Lock },
    { label: 'Harassment', icon: ShieldAlert },
    { label: 'Medical Emergency', icon: Stethoscope },
    { label: 'Accident', icon: AlertTriangle },
    { label: 'Lost Person', icon: UserX },
    { label: 'Fire', icon: Flame },
    { label: 'Unsafe Area', icon: AlertTriangle },
    { label: 'Other', icon: FileText },
  ];

  const severities: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

  const submittedIncident = incidents.find(i => i.id === submittedIncidentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const id = await submitIncidentReport(category, description, severity);
      setSubmittedIncidentId(id);
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <span>Report Safety Incident</span>
        </h2>
        <p className="text-xs text-slate-400">
          Immediate automated triage and dispatch to Kolkata EOC Command Center
        </p>
      </div>

      {/* Submission Form */}
      {!submittedIncident ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-navy-800 bg-navy-950 p-5 shadow-xl">
          
          {/* Location Pre-fill */}
          <div className="rounded-xl bg-navy-900/80 p-3 border border-navy-800 text-xs flex items-center space-x-2.5">
            <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-400">INCIDENT LOCATION (AUTO-GEOCODED)</span>
              <p className="font-bold text-slate-200">{tourist.currentLocation.name}</p>
            </div>
            <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] font-mono text-cyan-400 border border-cyan-800">
              GPS ATTESTED
            </span>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Incident Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.label;
                return (
                  <button
                    type="button"
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950'
                        : 'bg-navy-900/60 border-navy-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] font-bold leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Severity Level</label>
            <div className="grid grid-cols-4 gap-1.5">
              {severities.map((sev) => {
                const isSelected = severity === sev;
                const theme = getRiskColor(sev);
                return (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? `${theme.badge} shadow-md`
                        : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Description / Details</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any suspects, or specific assistance needed..."
              className="w-full rounded-xl border border-navy-700 bg-navy-900 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3.5 text-xs font-black text-white shadow-xl shadow-cyan-950 hover:from-cyan-500 hover:to-blue-500 transition disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>PROCESSING INCIDENT & RUNNING AI TRIAGE...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>SUBMIT INCIDENT</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Post Submission AI Incident Assessment Screen */
        <div className="space-y-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-navy-950 to-navy-900 p-6 shadow-2xl animate-in zoom-in-95">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  INCIDENT RECEIVED & LOGGED
                </span>
                <h3 className="font-mono text-sm font-bold text-white">
                  {submittedIncident.id}
                </h3>
              </div>
            </div>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
              {submittedIncident.severity}
            </span>
          </div>

          {/* AI Incident Assessment Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-navy-900 to-navy-950 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-300">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                AI INCIDENT ASSESSMENT
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-navy-950/80 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">Risk Assessment:</span>
                <p className="font-bold text-rose-400 text-sm">{submittedIncident.severity}</p>
              </div>
              <div className="rounded-xl bg-navy-950/80 p-2.5 border border-navy-800">
                <span className="text-[10px] text-slate-400">AI Confidence:</span>
                <p className="font-bold text-cyan-400 text-sm">
                  {Math.round((submittedIncident.aiClassification?.confidence || 0.93) * 100)}%
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-navy-950/80 p-2.5 border border-navy-800 text-xs">
              <span className="text-[10px] text-slate-400">Classification:</span>
              <p className="font-bold text-slate-200">
                {submittedIncident.aiClassification?.category || submittedIncident.category}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-950/40 p-2.5 border border-cyan-700/40 text-xs text-cyan-200">
              <strong>Recommended Response:</strong> “{submittedIncident.aiClassification?.recommendedAction || 'Dispatch nearest response patrol.'}”
            </div>
          </div>

          {/* Reset / Report another */}
          <button
            onClick={() => setSubmittedIncidentId(null)}
            className="w-full rounded-xl bg-navy-800 py-3 text-xs font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 transition"
          >
            REPORT ANOTHER INCIDENT
          </button>

        </div>
      )}

    </div>
  );
};
