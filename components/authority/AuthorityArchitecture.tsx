'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Smartphone, 
  Layers, 
  Database, 
  Radio, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowDown, 
  ArrowRight,
  Server,
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';

interface ComponentDetail {
  name: string;
  category: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  productionTech: string;
}

export const AuthorityArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ComponentDetail | null>({
    name: 'AI Risk Engine',
    category: 'Application Intelligence Layer',
    purpose: 'Continuously evaluates multi-variate risk matrices combining environmental, spatial crowd congestion and incident telemetry.',
    inputs: ['GPS Coordinates', 'Vision AI Crowd Density', 'IMD Weather Telemetry', 'Active CAD Incidents'],
    outputs: ['Safety Score (0-100)', 'Risk Classification', 'Dynamic Green Bypass Routes', 'Automated CAD Alerts'],
    productionTech: 'FastAPI / Python, XGBoost + PyTorch Graph Neural Networks, Redis Vector Store, Vertex AI',
  });

  const nodeDetails: Record<string, ComponentDetail> = {
    tourist: {
      name: 'Tourist Mobile Companion (Edge Node)',
      category: 'Client Edge Layer',
      purpose: 'Runs lightweight autonomous threat detection, displays circular safety gauge, handles one-touch SOS and caches offline packages.',
      inputs: ['Hardware GPS sensor', 'Cellular/Mesh Radio', 'User Touch / Panic Input'],
      outputs: ['Encrypted telemetry beacon', 'Zero-Knowledge ID presentation', 'Incident reports'],
      productionTech: 'React Native / Flutter, SQLite Edge Cache, WebCrypto SubtleCrypto API',
    },
    api: {
      name: 'API & Secure Ingress Gateway Layer',
      category: 'Ingress & Orchestration Layer',
      purpose: 'Authenticates edge requests, manages bidirectional WebSockets for live CAD telemetry, and enforces privacy barriers.',
      inputs: ['Edge telemetry packets', 'EOC Command instructions', 'Third-party municipal feeds'],
      outputs: ['Sanitized event streams', 'CAD dispatch triggers', 'Push notifications'],
      productionTech: 'Node.js / Go Gateway, Apache Kafka Event Bus, Envoy Proxy, gRPC',
    },
    geofence: {
      name: 'Spatial Geofencing Engine',
      category: 'Spatial Processing Engine',
      purpose: 'Performs point-in-polygon and buffer zone calculations at sub-10ms latency to detect caution perimeter entry.',
      inputs: ['GPS Coordinate stream', 'Active Municipal Polygon Registry (GeoJSON)'],
      outputs: ['Boundary breach events', 'Contextual tourist advisories', 'Dynamic perimeter status'],
      productionTech: 'PostgreSQL + PostGIS (ST_Contains, ST_DWithin), Redis GEO, Turf.js',
    },
    ai: {
      name: 'AI Risk Engine',
      category: 'Application Intelligence Layer',
      purpose: 'Continuously evaluates multi-variate risk matrices combining environmental, spatial crowd congestion and incident telemetry.',
      inputs: ['GPS Coordinates', 'Vision AI Crowd Density', 'IMD Weather Telemetry', 'Active CAD Incidents'],
      outputs: ['Safety Score (0-100)', 'Risk Classification', 'Dynamic Green Bypass Routes', 'Automated CAD Alerts'],
      productionTech: 'FastAPI / Python, XGBoost + PyTorch Graph Neural Networks, Redis Vector Store, Vertex AI',
    },
    incident: {
      name: 'Incident CAD & Triage Engine',
      category: 'Tactical Dispatch Layer',
      purpose: 'Processes tourist reports and emergency SOS signals, scores threat severity, and matches optimal nearest responders.',
      inputs: ['Tourist incident submissions', 'SOS trigger packets', 'Emergency unit availability'],
      outputs: ['Assigned Response Unit (Police/Ambulance)', 'Cadence ETA calculations', 'CAD Dispatch Tickets'],
      productionTech: 'Custom Municipal CAD Backend, OSRM / Google Routes API, Temporal.io Workflow Orchestrator',
    },
    blockchain: {
      name: 'Digital ID & Blockchain Verification Subnet',
      category: 'Decentralized Trust Layer',
      purpose: 'Validates zero-knowledge proofs of tourist travel credentials without storing personal identities or GPS trails on-chain.',
      inputs: ['ZK-Snark Proof', 'Passport Merkle Root', 'Digital Tourist ID Number'],
      outputs: ['Verification Status (Valid / Revoked)', 'Block Timestamp Attestation', 'CAD Dispatch Authorization'],
      productionTech: 'Polygon Supernets / Ethereum Layer 2 Private Subnet, Circom / snarkjs, ERC-735 Verifiable Credentials',
    },
    database: {
      name: 'Data & Situational Intelligence Layer',
      category: 'Persistent Data Layer',
      purpose: 'Stores spatial polygons, historical crowd patterns, anonymized telemetry metrics and emergency responder rosters.',
      inputs: ['Kafka Ingress streams', 'CAD Logs', 'City sensor feeds'],
      outputs: ['Queryable geospatial intelligence', 'Analytics datasets', 'Audit trails'],
      productionTech: 'PostgreSQL 16 + TimescaleDB, Amazon S3 for encrypted document storage, OpenSearch',
    },
    authority: {
      name: 'Safety Authority EOC Command Center',
      category: 'Command & Control Layer',
      purpose: 'Desktop-first dashboard giving municipal dispatchers total situational awareness and one-click emergency control.',
      inputs: ['Live incident stream', 'Vision AI crowd alerts', 'Emergency vehicle telemetry'],
      outputs: ['Responder dispatch commands', 'Public safety advisories', 'Incident resolution attestations'],
      productionTech: 'Next.js 14, WebSockets, Leaflet / Mapbox GL JS, Tailwind CSS',
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-navy-800 bg-navy-900/80 p-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <span>Interactive GovTech System Architecture & Data Flows</span>
          </h2>
          <p className="text-xs text-slate-400">
            Click any component node to inspect its operational purpose, I/O parameters and production technology stack
          </p>
        </div>
      </div>

      {/* Interactive Architecture Canvas */}
      <div className="rounded-3xl border border-navy-800 bg-navy-950 p-6 shadow-2xl space-y-6">
        
        {/* Row 1: Client Edge & Decentralized Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedNode(nodeDetails.tourist)}
            className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-navy-900 to-navy-950 p-4 cursor-pointer hover:border-cyan-400 transition shadow-lg space-y-1"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
              <Smartphone className="h-4 w-4" />
              <span>TOURIST APP (MOBILE EDGE)</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Autonomous safety bubble, dynamic safety gauge, one-touch SOS & offline caching
            </p>
          </div>

          <div
            onClick={() => setSelectedNode(nodeDetails.blockchain)}
            className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-navy-900 to-navy-950 p-4 cursor-pointer hover:border-emerald-400 transition shadow-lg space-y-1"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <Lock className="h-4 w-4" />
              <span>DIGITAL TOURIST ID (ZK-PROOF BLOCKCHAIN)</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Zero-knowledge credential attestation on Gov-Polygon Private Safety Subnet
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </div>

        {/* Row 2: API & Gateway Layer */}
        <div
          onClick={() => setSelectedNode(nodeDetails.api)}
          className="rounded-2xl border border-blue-500/40 bg-navy-900 p-4 cursor-pointer hover:border-blue-400 transition shadow-lg space-y-1 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-blue-400">
            <Server className="h-4 w-4" />
            <span>API & SECURE INGRESS GATEWAY LAYER</span>
          </div>
          <p className="text-xs text-slate-300">
            Bi-directional WebSockets, privacy gateway barrier & event streaming bus (Kafka)
          </p>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </div>

        {/* Row 3: Processing Engines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setSelectedNode(nodeDetails.geofence)}
            className="rounded-2xl border border-amber-500/40 bg-navy-900/80 p-3.5 cursor-pointer hover:border-amber-400 transition space-y-1"
          >
            <span className="text-[11px] font-bold text-amber-400 block">GEOFENCING ENGINE</span>
            <p className="text-[11px] text-slate-300">Point-in-polygon hazard boundary collision calculations</p>
          </div>

          <div
            onClick={() => setSelectedNode(nodeDetails.ai)}
            className="rounded-2xl border border-cyan-500/50 bg-cyan-950/30 p-3.5 cursor-pointer hover:border-cyan-300 transition space-y-1 shadow-md shadow-cyan-950"
          >
            <span className="text-[11px] font-bold text-cyan-300 block">AI RISK ENGINE</span>
            <p className="text-[11px] text-slate-200">Environmental threat scoring & safe bypass route generation</p>
          </div>

          <div
            onClick={() => setSelectedNode(nodeDetails.incident)}
            className="rounded-2xl border border-rose-500/40 bg-navy-900/80 p-3.5 cursor-pointer hover:border-rose-400 transition space-y-1"
          >
            <span className="text-[11px] font-bold text-rose-400 block">INCIDENT CAD ENGINE</span>
            <p className="text-[11px] text-slate-300">Semantic report classification & nearest responder dispatch</p>
          </div>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </div>

        {/* Row 4: Persistent Data & Command Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedNode(nodeDetails.database)}
            className="rounded-2xl border border-navy-700 bg-navy-900/80 p-4 cursor-pointer hover:border-cyan-500 transition space-y-1"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Database className="h-4 w-4 text-cyan-400" />
              <span>DATA & SITUATIONAL INTELLIGENCE LAYER</span>
            </div>
            <p className="text-xs text-slate-400">PostGIS spatial clusters, ML feature store & CAD audit logs</p>
          </div>

          <div
            onClick={() => setSelectedNode(nodeDetails.authority)}
            className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-navy-900 to-navy-950 p-4 cursor-pointer hover:border-cyan-400 transition space-y-1 shadow-lg"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
              <Radio className="h-4 w-4" />
              <span>AUTHORITY EOC COMMAND CENTER</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Live situational map, responder CAD dispatch & city-wide risk analytics
            </p>
          </div>
        </div>

      </div>

      {/* Selected Component Deep Dive Inspector */}
      {selectedNode && (
        <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-start justify-between border-b border-navy-800 pb-3">
            <div>
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                {selectedNode.category}
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {selectedNode.name}
              </h3>
            </div>
            <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              ARCHITECTURE NODE
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {selectedNode.purpose}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                INPUT PARAMETERS
              </span>
              <ul className="space-y-1 text-slate-300">
                {selectedNode.inputs.map((inp, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                OUTPUT EMISSIONS
              </span>
              <ul className="space-y-1 text-slate-300">
                {selectedNode.outputs.map((out, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-navy-950 p-3 border border-navy-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">FUTURE PRODUCTION TECHNOLOGY STACK:</span>
            <p className="font-mono text-cyan-300 text-[11px]">{selectedNode.productionTech}</p>
          </div>
        </div>
      )}

    </div>
  );
};
