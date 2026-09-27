'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Map, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Radio, 
  Zap, 
  CreditCard, 
  BrainCircuit, 
  Settings,
  AlertOctagon,
  PhoneCall,
  Activity,
  Layers,
  FileCheck,
  Database
} from 'lucide-react';
import { useSafetyStore } from '@/store/safetyStore';

interface AuthorityLayoutProps {
  children: React.ReactNode;
}

export const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { tourist, incidents, emergencyUnits, geofences, alerts } = useSafetyStore();

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'Resolved');
  const dispatchedUnits = emergencyUnits.filter(u => u.status === 'Dispatched');

  const navItems = [
    { href: '/authority', label: 'Overview', icon: Activity },
    { href: '/authority/map', label: 'Live Safety Map', icon: Map },
    { href: '/authority/incidents', label: 'Incidents CAD', icon: AlertTriangle, badge: activeIncidents.length },
    { href: '/authority/tourists', label: 'Tourist Monitoring', icon: Users },
    { href: '/authority/response', label: 'Emergency Response', icon: Radio, alert: criticalIncidents.length > 0 },
    { href: '/authority/analytics', label: 'Risk Analytics', icon: BarChart3 },
    { href: '/authority/crowd', label: 'Crowd Analytics', icon: Users },
    { href: '/authority/geofences', label: 'Geofences', icon: Shield },
    { href: '/authority/verification', label: 'Digital ID Registry', icon: CreditCard },
    { href: '/authority/insights', label: 'AI Insights', icon: BrainCircuit },
    { href: '/authority/data-intelligence', label: 'Data Intelligence', icon: Database },
    { href: '/authority/audit', label: 'Audit Trail', icon: FileCheck },
    { href: '/authority/architecture', label: 'Architecture', icon: Layers },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-navy-950 flex flex-col">
      
      {/* Critical SOS Active Flash Banner for Authority */}
      {tourist.sosActive && (
        <div className="w-full bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-2.5 shadow-lg shadow-rose-950/60 flex items-center justify-between text-white text-xs font-bold animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="h-4 w-4 text-white animate-bounce" />
            <span>CRITICAL SOS EVENT ACTIVE: Tourist {tourist.name} ({tourist.digitalId.idNumber}) at {tourist.currentLocation.name}</span>
          </div>
          <Link
            href="/authority/response"
            className="rounded-lg bg-white px-3 py-1 text-xs font-black text-rose-700 hover:bg-slate-100 transition shadow"
          >
            OPEN CAD CONSOLE →
          </Link>
        </div>
      )}

      {/* Main Body: Desktop Sidebar + Content */}
      <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col md:flex-row p-4 gap-4">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="rounded-2xl border border-navy-800 bg-navy-900/80 p-2.5 shadow-lg space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              EOC SITUATION COMMAND
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:bg-navy-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.alert && (
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Telemetry Status Card */}
          <div className="hidden md:block rounded-2xl border border-navy-800 bg-navy-900/50 p-3 text-[11px] text-slate-400 space-y-1.5 shadow">
            <div className="font-bold text-slate-300 flex items-center justify-between">
              <span>System Health</span>
              <span className="text-emerald-400 font-bold">99.98%</span>
            </div>
            <div className="text-[10px]">AI Risk Engine: Online (14ms)</div>
            <div className="text-[10px]">Gov-Polygon Subnet: Synced (#19482931)</div>
            <div className="text-[10px]">Kolkata Police CAD: Connected</div>
          </div>
        </aside>

        {/* Dynamic Authority Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};
