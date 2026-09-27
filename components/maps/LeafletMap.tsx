'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { GeofenceZone, EmergencyUnit, Incident } from '@/types';
import { 
  Layers, 
  Navigation, 
  Shield, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Eye, 
  Filter,
  X,
  Users,
  Hospital,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { mockTouristDensityPoints } from '@/services/mockData';

interface LeafletMapProps {
  height?: string;
  showAllTourists?: boolean;
  interactiveTourist?: boolean;
  onSelectIncident?: (incident: Incident) => void;
  onSelectZone?: (zone: GeofenceZone) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  height = '500px',
  showAllTourists = false,
  interactiveTourist = true,
  onSelectIncident,
  onSelectZone,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<{
    geofences?: any;
    touristMarker?: any;
    safetyBubble?: any;
    emergencyUnits?: any;
    incidents?: any;
    touristDensity?: any;
    crowdHeat?: any;
  }>({});

  const [layersOpen, setLayersOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  // 6 Granular Layer Toggles
  const [showSafetyZones, setShowSafetyZones] = useState(true);
  const [showCrowd, setShowCrowd] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);
  const [showTourists, setShowTourists] = useState(showAllTourists);

  const [mapLoaded, setMapLoaded] = useState(false);

  // Inspector Card
  const [inspectedZone, setInspectedZone] = useState<GeofenceZone | null>(null);

  const { tourist, geofences, emergencyUnits, incidents, setTouristLocation } = useSafetyStore();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!isMounted || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: [tourist.currentLocation.lat, tourist.currentLocation.lng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      if (interactiveTourist) {
        map.on('click', (e: any) => {
          setTouristLocation(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers dynamically
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const renderLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // 1. GEOFENCES & SAFETY ZONES LAYER
      if (layersGroupRef.current.geofences) {
        layersGroupRef.current.geofences.clearLayers();
      } else {
        layersGroupRef.current.geofences = L.layerGroup().addTo(map);
      }

      if (showGeofences || showSafetyZones) {
        geofences.forEach((zone: GeofenceZone) => {
          if (!showSafetyZones && zone.type === 'SAFE') return;
          if (!showGeofences && zone.type !== 'SAFE') return;

          const color = 
            zone.type === 'SAFE' ? '#10b981' :
            zone.type === 'CAUTION' ? '#f59e0b' :
            zone.type === 'HIGH_RISK' ? '#f97316' : '#ef4444';

          const circle = L.circle(zone.center, {
            color: color,
            fillColor: color,
            fillOpacity: zone.type === 'SAFE' ? 0.08 : 0.18,
            weight: 2,
            dashArray: zone.type === 'CAUTION' ? '5, 5' : undefined,
            radius: zone.radius,
          });

          circle.on('click', () => {
            setInspectedZone(zone);
            if (onSelectZone) onSelectZone(zone);
          });

          layersGroupRef.current.geofences.addLayer(circle);
        });
      }

      // 2. TOURIST MARKER & SAFETY BUBBLE
      if (layersGroupRef.current.touristMarker) {
        layersGroupRef.current.touristMarker.remove();
      }
      if (layersGroupRef.current.safetyBubble) {
        layersGroupRef.current.safetyBubble.remove();
      }

      const touristPos: [number, number] = [tourist.currentLocation.lat, tourist.currentLocation.lng];

      if (tourist.invisibleSafetyBubbleActive) {
        const bubbleColor = tourist.sosActive ? '#ef4444' : tourist.safetyScore.score < 75 ? '#f59e0b' : '#06b6d4';
        const bubble = L.circle(touristPos, {
          color: bubbleColor,
          fillColor: bubbleColor,
          fillOpacity: 0.12,
          weight: 1.5,
          radius: 180,
        }).addTo(map);
        layersGroupRef.current.safetyBubble = bubble;
      }

      const touristIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full ${tourist.sosActive ? 'bg-rose-500/40 animate-ping' : 'bg-cyan-500/30 radar-circle'}"></div>
          <div class="relative flex h-8 w-8 items-center justify-center rounded-full ${tourist.sosActive ? 'bg-rose-600 border-2 border-white' : 'bg-cyan-600 border-2 border-white'} shadow-lg text-white font-bold text-xs">
            ${tourist.sosActive ? '🆘' : '👤'}
          </div>
        </div>
      `;

      const touristIcon = L.divIcon({
        className: 'custom-tourist-marker',
        html: touristIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const touristMarker = L.marker(touristPos, { icon: touristIcon }).addTo(map);
      layersGroupRef.current.touristMarker = touristMarker;

      // 3. EMERGENCY UNITS
      if (layersGroupRef.current.emergencyUnits) {
        layersGroupRef.current.emergencyUnits.clearLayers();
      } else {
        layersGroupRef.current.emergencyUnits = L.layerGroup().addTo(map);
      }

      if (showEmergency) {
        emergencyUnits.forEach((unit: EmergencyUnit) => {
          const isAssigned = unit.status === 'Dispatched';
          const iconEmoji = unit.type.includes('Ambulance') ? '🚑' : unit.type.includes('Police') ? '🚓' : '🏍️';
          
          const unitIconHtml = `
            <div class="relative flex items-center justify-center">
              ${isAssigned ? '<div class="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping"></div>' : ''}
              <div class="flex h-7 w-7 items-center justify-center rounded-full ${isAssigned ? 'bg-rose-600 border border-white' : 'bg-navy-900 border border-cyan-500'} shadow-md text-xs">
                ${iconEmoji}
              </div>
            </div>
          `;

          const unitIcon = L.divIcon({
            className: 'custom-unit-marker',
            html: unitIconHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker(unit.location, { icon: unitIcon });
          marker.bindPopup(`
            <div class="p-2 space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-cyan-300">${unit.callSign}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] ${unit.status === 'Dispatched' ? 'bg-rose-900 text-rose-300 font-bold' : 'bg-emerald-900 text-emerald-300'}">${unit.status}</span>
              </div>
              <div class="text-xs text-slate-300"><strong>Station:</strong> ${unit.locationName}</div>
              <div class="text-xs text-slate-300"><strong>Est. Response:</strong> ${unit.etaMinutes || 2} min (${unit.distanceKm || 0.35} km)</div>
              <div class="text-xs text-slate-400 font-mono">CAD: ${unit.contactNumber}</div>
            </div>
          `);

          layersGroupRef.current.emergencyUnits.addLayer(marker);
        });
      }

      // 4. INCIDENTS LAYER
      if (layersGroupRef.current.incidents) {
        layersGroupRef.current.incidents.clearLayers();
      } else {
        layersGroupRef.current.incidents = L.layerGroup().addTo(map);
      }

      if (showIncidents) {
        incidents.filter(inc => inc.status !== 'Resolved').forEach((inc: Incident) => {
          const isSOS = inc.isSOS;
          const incIconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div class="absolute -inset-1.5 rounded-full ${isSOS ? 'bg-rose-500/50 animate-ping' : 'bg-amber-500/40 animate-pulse'}"></div>
              <div class="flex h-7 w-7 items-center justify-center rounded-full ${isSOS ? 'bg-rose-700 border-2 border-white' : 'bg-amber-600 border border-slate-900'} text-white text-xs font-bold shadow-lg">
                ${isSOS ? '🚨' : '⚠️'}
              </div>
            </div>
          `;

          const incIcon = L.divIcon({
            className: 'custom-incident-marker',
            html: incIconHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker(inc.location, { icon: incIcon });
          marker.on('click', () => {
            if (onSelectIncident) onSelectIncident(inc);
          });

          layersGroupRef.current.incidents.addLayer(marker);
        });
      }

      // 5. ANONYMIZED TOURIST DENSITY CLUSTERS
      if (layersGroupRef.current.touristDensity) {
        layersGroupRef.current.touristDensity.clearLayers();
      } else {
        layersGroupRef.current.touristDensity = L.layerGroup().addTo(map);
      }

      if (showTourists) {
        mockTouristDensityPoints.slice(0, 30).forEach((t) => {
          const circleMarker = L.circleMarker([t.lat, t.lng], {
            radius: 5,
            fillColor: t.risk === 'HIGH' ? '#f43f5e' : t.risk === 'MODERATE' ? '#f59e0b' : '#06b6d4',
            color: '#ffffff',
            weight: 1,
            fillOpacity: 0.85,
          });

          circleMarker.bindPopup(`
            <div class="p-1.5 text-xs">
              <div class="font-bold text-slate-100">${t.name} (${t.nationality})</div>
              <div class="text-[11px] text-slate-300">Safety Index: <strong class="text-cyan-400">${t.safetyScore}/100</strong></div>
              <div class="text-[10px] text-slate-400">Anonymized Telemetry ID: ${t.id}</div>
            </div>
          `);

          layersGroupRef.current.touristDensity.addLayer(circleMarker);
        });
      }
    };

    renderLayers();
  }, [mapLoaded, tourist, geofences, emergencyUnits, incidents, showGeofences, showSafetyZones, showCrowd, showIncidents, showEmergency, showTourists]);

  // Recenter map on tourist location
  const recenterTourist = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([tourist.currentLocation.lat, tourist.currentLocation.lng], 16, {
        duration: 1.2,
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-navy-800 bg-navy-950 shadow-2xl">
      
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-2 rounded-xl bg-navy-950/90 px-3 py-1.5 text-xs font-semibold text-white border border-navy-700 shadow-md backdrop-blur-md">
          <Shield className="h-4 w-4 text-cyan-400" />
          <span>KOLKATA SMART SHIELD</span>
        </div>

        {/* Permanently Visible Simulated Data Badge */}
        <div className="flex items-center space-x-1.5 rounded-xl bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-bold text-amber-300 border border-amber-500/20 shadow-md backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>SIMULATED DATA</span>
        </div>

        {/* Safety Bubble Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-cyan-950/80 px-2.5 py-1.5 text-xs font-medium text-cyan-300 border border-cyan-800/60 shadow-md backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>BUBBLE: ACTIVE</span>
        </div>
      </div>

      {/* Map Control Buttons (Layers, Legend & Recenter) */}
      <div className="absolute bottom-4 right-3 z-[400] flex flex-col space-y-2">
        <button
          onClick={recenterTourist}
          title="Recenter to Tourist GPS"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/90 text-cyan-400 border border-navy-700 shadow-lg hover:bg-navy-800 hover:text-cyan-300 backdrop-blur-md transition-all active:scale-95"
        >
          <Navigation className="h-5 w-5" />
        </button>

        {/* Legend Button */}
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          title="Map Legend"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/90 text-slate-300 border border-navy-700 shadow-lg hover:bg-navy-800 hover:text-white backdrop-blur-md transition-all"
        >
          <Eye className="h-5 w-5" />
        </button>

        {/* Layers Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            title="Toggle Map Layers"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900/90 text-slate-300 border border-navy-700 shadow-lg hover:bg-navy-800 hover:text-white backdrop-blur-md transition-all"
          >
            <Layers className="h-5 w-5" />
          </button>

          {/* 6 Layer Controls Menu */}
          {layersOpen && (
            <div className="absolute bottom-12 right-0 w-56 rounded-2xl bg-navy-950/95 p-3.5 text-xs shadow-2xl border border-navy-700 backdrop-blur-md space-y-2.5">
              <div className="font-bold text-slate-200 border-b border-navy-800 pb-1.5 flex items-center justify-between">
                <span>Map Layers</span>
                <Filter className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              
              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  <span>SAFETY (Safe Zones)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showSafetyZones}
                  onChange={(e) => setShowSafetyZones(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  <span>CROWD (Density Heat)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showCrowd}
                  onChange={(e) => setShowCrowd(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                  <span>INCIDENTS (CAD Calls)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={(e) => setShowIncidents(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400"></span>
                  <span>GEOFENCES (Perimeters)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showGeofences}
                  onChange={(e) => setShowGeofences(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                  <span>EMERGENCY (Units/CAD)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showEmergency}
                  onChange={(e) => setShowEmergency(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-300"></span>
                  <span>TOURIST (Clusters)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showTourists}
                  onChange={(e) => setShowTourists(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          )}

          {/* Map Legend Popup */}
          {legendOpen && (
            <div className="absolute bottom-12 right-0 w-60 rounded-2xl bg-navy-950/95 p-3.5 text-xs shadow-2xl border border-navy-700 backdrop-blur-md space-y-2">
              <div className="font-bold text-slate-200 border-b border-navy-800 pb-1 flex items-center justify-between">
                <span>Map Legend</span>
                <button onClick={() => setLegendOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500/40 border border-emerald-400" />
                  <span className="text-slate-300">Safe Zone (Monitored Corridor)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500/40 border border-amber-400 border-dashed" />
                  <span className="text-slate-300">Caution Zone (Transit Congestion)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/40 border border-rose-400" />
                  <span className="text-slate-300">High Risk / Construction Barrier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">👤</span>
                  <span className="text-slate-300">Tourist GPS Location (180m Bubble)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">🚓 🚑</span>
                  <span className="text-slate-300">Emergency CAD Unit (Live Telemetry)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone Information Click Modal / Side Card */}
      {inspectedZone && (
        <div className="absolute top-14 left-3 z-[400] max-w-sm w-[90%] sm:w-80 rounded-2xl border border-cyan-500/40 bg-navy-950/95 p-4 shadow-2xl backdrop-blur-md space-y-2.5 animate-in slide-in-from-left-3 fade-in duration-200">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${
                inspectedZone.type === 'SAFE' ? 'bg-emerald-400' :
                inspectedZone.type === 'CAUTION' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="text-xs font-bold text-white uppercase">{inspectedZone.name}</span>
            </div>
            <button onClick={() => setInspectedZone(null)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-navy-900/80 p-2 border border-navy-800">
              <span className="text-[10px] text-slate-400">CURRENT RISK</span>
              <p className="font-bold text-white">{inspectedZone.riskLevel}</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-2 border border-navy-800">
              <span className="text-[10px] text-slate-400">CROWD DENSITY</span>
              <p className="font-bold text-amber-400">{inspectedZone.crowdLevel}</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-2 border border-navy-800">
              <span className="text-[10px] text-slate-400">RECENT INCIDENTS</span>
              <p className="font-bold text-rose-400">{inspectedZone.activeIncidentsCount} Active</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-2 border border-navy-800">
              <span className="text-[10px] text-slate-400">PREDICTED RISK</span>
              <p className="font-bold text-cyan-400">{inspectedZone.predictedRisk || 'MODERATE'}</p>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nearest Police:</span>
              <span className="font-semibold text-slate-200">{inspectedZone.nearestPoliceUnit || 'P-17 (0.4 km)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nearest Hospital:</span>
              <span className="font-semibold text-slate-200">{inspectedZone.nearestHospital || 'SSKM Trauma (1.1 km)'}</span>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-950/40 p-2.5 border border-cyan-800/40 text-xs text-cyan-200">
            <strong>AI Recommendation:</strong> “{inspectedZone.aiRecommendation || 'Maintain standard safe corridor routing.'}”
          </div>
        </div>
      )}

      {/* Interactive Location Teleport Bar */}
      {interactiveTourist && (
        <div className="absolute bottom-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 max-w-[80%]">
          <span className="text-[10px] font-bold text-slate-400 bg-navy-950/90 px-2 py-1 rounded-md border border-navy-800">
            SIMULATE POSITION:
          </span>
          <button
            onClick={() => setTouristLocation(22.5535, 88.3524, 'Park Street Tourist Corridor')}
            className="text-[11px] rounded-lg bg-emerald-500/20 px-2.5 py-1 font-semibold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 backdrop-blur-md transition"
          >
            ● Park St (Safe)
          </button>
          <button
            onClick={() => setTouristLocation(22.5645, 88.3520, 'Esplanade Transit Hub')}
            className="text-[11px] rounded-lg bg-amber-500/20 px-2.5 py-1 font-semibold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 backdrop-blur-md transition"
          >
            ● Esplanade (Caution)
          </button>
          <button
            onClick={() => setTouristLocation(22.5684, 88.3615, 'Bowbazar Construction Zone')}
            className="text-[11px] rounded-lg bg-rose-500/20 px-2.5 py-1 font-semibold text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 backdrop-blur-md transition"
          >
            ● Bowbazar (Risk)
          </button>
        </div>
      )}

      {/* Map DOM Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }}
        className="w-full bg-navy-950"
      />
    </div>
  );
};
