'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Map, 
  Bell, 
  CreditCard, 
  FileText, 
  User, 
  ShieldAlert, 
  Smartphone,
  Maximize2,
  WifiOff,
  Lock
} from 'lucide-react';
import { useSafetyStore } from '@/store/safetyStore';
import { SOSModal } from './SOSModal';
import { GeofenceAlertModal } from './GeofenceAlertModal';

interface TouristLayoutProps {
  children: React.ReactNode;
}

export const TouristLayout: React.FC<TouristLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { tourist, alerts, isOfflineMode } = useSafetyStore();
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const navItems = [
    { href: '/tourist', label: 'Home', icon: Home },
    { href: '/tourist/map', label: 'Safety Map', icon: Map },
    { href: '/tourist/alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : null },
    { href: '/tourist/digital-id', label: 'Digital ID', icon: CreditCard },
    { href: '/tourist/offline', label: 'Offline', icon: WifiOff, alert: isOfflineMode },
    { href: '/tourist/incident', label: 'Report', icon: FileText },
    { href: '/tourist/profile', label: 'Profile', icon: User },
    { href: '/tourist/privacy', label: 'Privacy', icon: Lock },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-navy-950 py-4 px-2 sm:px-4 flex flex-col items-center">
      
      {/* Device View Toggle for Desktop Judges */}
      <div className="hidden md:flex items-center justify-between w-full max-w-2xl mb-2 px-2 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5 font-bold text-slate-300">
          <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
          <span>Mobile-First Tourist Companion & Safety Shield</span>
        </span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition font-semibold"
        >
          <Maximize2 className="h-3 w-3" />
          <span>{isPhoneFrame ? 'Expand View' : 'Phone Frame Mode'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className={`relative w-full ${isPhoneFrame ? 'max-w-[430px] rounded-3xl border-4 border-navy-800 shadow-2xl overflow-hidden' : 'max-w-2xl'} bg-navy-900/90 rounded-2xl border border-navy-800 flex flex-col min-h-[780px] shadow-xl`}>
        
        {/* Active Emergency SOS Top Ribbon */}
        {tourist.sosActive && (
          <div 
            onClick={() => setSosModalOpen(true)}
            className="w-full bg-rose-600 hover:bg-rose-500 cursor-pointer px-4 py-2.5 flex items-center justify-between text-white text-xs font-bold transition-all shadow-md"
          >
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-ping"></span>
              <span>EMERGENCY SOS ACTIVE • RESPONDER EN ROUTE</span>
            </div>
            <span className="underline">VIEW CAD STATUS →</span>
          </div>
        )}

        {/* Offline Active Indicator Ribbon */}
        {isOfflineMode && !tourist.sosActive && (
          <div className="w-full bg-purple-950 px-4 py-1.5 flex items-center justify-between text-purple-300 text-[11px] font-bold border-b border-purple-800/60">
            <span className="flex items-center space-x-1.5">
              <WifiOff className="h-3 w-3 text-purple-400" />
              <span>OFFLINE SAFETY COMPANION ACTIVE (STANDALONE CACHE)</span>
            </span>
            <Link href="/tourist/offline" className="underline text-purple-200">
              Manage
            </Link>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 pb-28 sm:p-5 sm:pb-28">
          {children}
        </main>

        {/* Floating SOS Button */}
        <div className="fixed bottom-20 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-20 z-40">
          <button
            onClick={() => setSosModalOpen(true)}
            aria-label="SOS Emergency Assistance"
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              tourist.sosActive 
                ? 'bg-rose-600 text-white ring-8 ring-rose-500/40 animate-pulse' 
                : 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-xl shadow-rose-600/40 hover:scale-110 active:scale-95'
            } border-2 border-white/80 transition-all`}
          >
            <div className="text-center">
              <ShieldAlert className="h-6 w-6 mx-auto -mb-0.5" />
              <span className="text-[11px] font-black tracking-tighter">SOS</span>
            </div>
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav aria-label="Tourist Mobile Navigation" className="sticky bottom-0 left-0 right-0 z-30 border-t border-navy-800 bg-navy-950/95 backdrop-blur-lg px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                    {item.alert && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

      </div>

      {/* Persistent Modals */}
      <SOSModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <GeofenceAlertModal />

    </div>
  );
};
