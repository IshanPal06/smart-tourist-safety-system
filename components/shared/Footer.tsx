'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Radio, Lock, Activity, Sparkles, Map, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-navy-800 bg-navy-950/95 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                SMART TOURIST SAFETY
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
              Explore freely. Stay protected intelligently. An AI-powered tourist safety and incident response platform designed for modern Smart Cities.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KOLKATA SMART CITY PROTOTYPE</span>
            </div>
          </div>

          {/* Tourist Platform Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Tourist Companion
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/tourist" className="hover:text-cyan-400 transition">
                  Safety Dashboard & Gauge
                </Link>
              </li>
              <li>
                <Link href="/tourist/map" className="hover:text-cyan-400 transition">
                  Live Safety Map & Geofences
                </Link>
              </li>
              <li>
                <Link href="/tourist/digital-id" className="hover:text-cyan-400 transition">
                  Digital Tourist ID (ZK-Proof)
                </Link>
              </li>
              <li>
                <Link href="/tourist/offline" className="hover:text-cyan-400 transition">
                  Offline Safety Mode
                </Link>
              </li>
              <li>
                <Link href="/tourist/profile" className="hover:text-cyan-400 transition">
                  Personalized Safety Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Authority EOC Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Authority Command Center
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/authority" className="hover:text-cyan-400 transition">
                  EOC Situation Overview
                </Link>
              </li>
              <li>
                <Link href="/authority/incidents" className="hover:text-cyan-400 transition">
                  Incident CAD Registry
                </Link>
              </li>
              <li>
                <Link href="/authority/tourists" className="hover:text-cyan-400 transition">
                  Anonymized Tourist Monitoring
                </Link>
              </li>
              <li>
                <Link href="/authority/crowd" className="hover:text-cyan-400 transition">
                  Vision AI Crowd Analytics
                </Link>
              </li>
              <li>
                <Link href="/authority/geofences" className="hover:text-cyan-400 transition">
                  Geofence Perimeter Manager
                </Link>
              </li>
              <li>
                <Link href="/authority/audit" className="hover:text-cyan-400 transition">
                  Immutable System Audit Trail
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & GovTech Integrity */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Architecture & Transparency
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/authority/architecture" className="hover:text-cyan-400 transition">
                  System Architecture & Data Flows
                </Link>
              </li>
              <li>
                <Link href="/tourist/privacy" className="hover:text-cyan-400 transition">
                  Privacy & Cryptographic Model
                </Link>
              </li>
              <li>
                <Link href="/authority/data-intelligence" className="hover:text-cyan-400 transition">
                  External Feeds & CAD Telemetry
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-cyan-400 transition font-bold text-cyan-300">
                  ▶ Run 15-Step Safety Demo
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-slate-400">
            Prototype & Demonstration Platform • Built for Smart City Hackathon / GovTech Technology Showcase.
          </p>
          <span className="rounded-full bg-navy-900 px-3 py-1 font-mono text-[10px] text-amber-300 border border-amber-500/20">
            “Safety, crime, crowd and incident information shown on this platform is simulated and intended solely for demonstration.”
          </span>
        </div>

      </div>
    </footer>
  );
};
