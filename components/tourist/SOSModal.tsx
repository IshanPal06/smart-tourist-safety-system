'use client';

import React, { useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { AlertOctagon, PhoneCall, ShieldAlert, CheckCircle2, Radio, Battery, Wifi, Navigation, X } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { tourist, triggerSOS, cancelSOS, emergencyUnits, incidents } = useSafetyStore();
  const [activationStep, setActivationStep] = useState<number>(0);
  const [isActivating, setIsActivating] = useState<boolean>(false);

  if (!isOpen && !tourist.sosActive) return null;

  const currentSosIncident = incidents.find(i => i.isSOS && i.status !== 'Resolved');
  const assignedUnit = currentSosIncident?.assignedUnit || emergencyUnits[0];

  const handleActivateSOS = async () => {
    setIsActivating(true);
    setActivationStep(1); // 1. Location captured

    setTimeout(() => setActivationStep(2), 600); // 2. Digital Tourist ID verified
    setTimeout(() => setActivationStep(3), 1200); // 3. Emergency center notified
    setTimeout(() => setActivationStep(4), 1800); // 4. Nearest responder identified
    setTimeout(() => setActivationStep(5), 2400); // 5. Emergency contact notified
    setTimeout(async () => {
      setActivationStep(6); // 6. Live location sharing activated
      await triggerSOS();
      setIsActivating(false);
    }, 3000);
  };

  const steps = [
    { num: 1, label: 'Location coordinates captured & geo-tagged' },
    { num: 2, label: 'Digital Tourist ID cryptographically verified' },
    { num: 3, label: 'Kolkata EOC Emergency Command Center notified' },
    { num: 4, label: 'Nearest mobile response unit identified' },
    { num: 5, label: 'Emergency contact Sarah Johnson notified via SMS' },
    { num: 6, label: 'Continuous live GPS telemetry broadcast activated' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/40 bg-gradient-to-b from-navy-900 to-navy-950 p-6 shadow-2xl shadow-rose-950/50">
        
        {/* Active SOS State Screen */}
        {tourist.sosActive ? (
          <div className="space-y-5">
            {/* Header Alert Banner */}
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse">
                  <AlertOctagon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-wider text-rose-500 flex items-center gap-2">
                    <span>SOS ACTIVE</span>
                    <span className="inline-flex h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
                  </h3>
                  <p className="text-xs text-slate-300">Command Center Emergency Protocol Engaged</p>
                </div>
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-navy-950/80 p-3.5 border border-navy-800 text-xs">
              <div>
                <span className="text-slate-400">Current Location</span>
                <p className="font-bold text-slate-100">{tourist.currentLocation.name}</p>
                <span className="font-mono text-[10px] text-cyan-400">
                  {tourist.currentLocation.lat.toFixed(4)}° N, {tourist.currentLocation.lng.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-slate-400">Digital Tourist ID</span>
                <p className="font-mono font-bold text-emerald-400">{tourist.digitalId.idNumber}</p>
                <span className="text-[10px] text-slate-400">ZK-Verified on Subnet</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-emerald-400" />
                <span>Battery: <strong>{tourist.batteryLevel}%</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-cyan-400" />
                <span>Network: <strong className="text-cyan-400">{tourist.networkStatus}</strong></span>
              </div>
            </div>

            {/* Assigned Responder Card */}
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Assigned First Responder</span>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300 border border-rose-500/30 animate-pulse">
                  DISPATCHED
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{assignedUnit.callSign}</h4>
                  <p className="text-xs text-slate-300">{assignedUnit.locationName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {assignedUnit.etaMinutes || 3} MIN
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Distance: {assignedUnit.distanceKm || 1.4} km
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-navy-800">
                <span className="text-slate-400">Direct Emergency Hotline:</span>
                <a href={`tel:${assignedUnit.contactNumber}`} className="flex items-center space-x-1 font-mono font-bold text-cyan-400 hover:underline">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>{assignedUnit.contactNumber}</span>
                </a>
              </div>
            </div>

            {/* Live Location Sharing Status */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-950/30 px-3.5 py-2.5 border border-emerald-500/30 text-xs">
              <div className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <div>
                  <span className="font-bold text-emerald-300">LIVE LOCATION SHARING: ACTIVE</span>
                  <p className="text-[10px] text-slate-400">Shared exclusively with Kolkata Police & Medical Dispatchers</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => cancelSOS()}
                className="flex-1 rounded-xl bg-navy-800 py-3 text-xs font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 transition"
              >
                STOP SHARING / CANCEL SOS
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-cyan-600 py-3 text-xs font-bold text-white hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/30"
              >
                KEEP TRACKING (CLOSE MODAL)
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation / Activation Step */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-inner">
                <ShieldAlert className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">
                EMERGENCY ASSISTANCE
              </h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto font-medium">
                Are you in immediate danger or requiring urgent medical / police response?
              </p>
            </div>

            {/* Simulated 6-step progress */}
            {isActivating && (
              <div className="space-y-2 rounded-xl bg-navy-950 p-4 border border-navy-800">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  Emergency Protocol Sequence:
                </div>
                {steps.map((s) => (
                  <div key={s.num} className="flex items-center space-x-2.5 text-xs">
                    {activationStep >= s.num ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                        {s.num}
                      </div>
                    )}
                    <span className={activationStep >= s.num ? 'text-slate-100 font-medium' : 'text-slate-500'}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            {!isActivating && (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-navy-800 py-3.5 text-sm font-bold text-slate-300 border border-navy-700 hover:bg-navy-700 transition"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleActivateSOS}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-600/30 hover:from-rose-500 hover:to-red-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  ACTIVATE SOS
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
