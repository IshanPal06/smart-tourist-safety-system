'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSafetyStore } from '@/store/safetyStore';
import { 
  KOLKATA_TOURIST_LOCATIONS, 
  TouristLocation, 
  LocationCategory, 
  KOLKATA_DEFAULT_CENTER, 
  KOLKATA_DEFAULT_ZOOM 
} from '@/services/touristLocations';
import { MLPredictionResult, MLTelemetryInput } from '@/types';
import { predictTouristRisk } from '@/services/mlService';
import { 
  Search, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  BrainCircuit, 
  Filter, 
  Layers, 
  X, 
  RefreshCw, 
  Info,
  CheckCircle2,
  Compass,
  AlertCircle
} from 'lucide-react';

interface InteractiveTouristMapProps {
  height?: string;
  onSelectLocation?: (loc: TouristLocation) => void;
  showInspector?: boolean;
}

export const InteractiveTouristMap: React.FC<InteractiveTouristMapProps> = ({
  height = '520px',
  onSelectLocation,
  showInspector = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const incidentMarkersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  const { tourist, incidents, setTouristLocation, addToast } = useSafetyStore();

  // Map state
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState<LocationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Incident layer toggle
  const [showIncidentsLayer, setShowIncidentsLayer] = useState(true);

  // Predictions Cache: { [locationId]: MLPredictionResult }
  const [locationPredictions, setLocationPredictions] = useState<{ [key: string]: MLPredictionResult }>({});
  const [predictingLocId, setPredictingLocId] = useState<string | null>(null);

  // User location state
  const [locatingUser, setLocatingUser] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  // Filtered Locations
  const filteredLocations = useMemo(() => {
    return KOLKATA_TOURIST_LOCATIONS.filter((loc) => {
      const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
      const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            loc.landmark.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // 1. Initialize Leaflet Map with OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        if (!isMounted || !mapContainerRef.current) return;

        // Custom default icon path fix
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Initialize Map centered on Kolkata
        const map = L.map(mapContainerRef.current, {
          center: KOLKATA_DEFAULT_CENTER,
          zoom: KOLKATA_DEFAULT_ZOOM,
          zoomControl: false,
          attributionControl: true,
        });

        // OpenStreetMap Default Tile Layer with required attribution
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Zoom control on top right
        L.control.zoom({ position: 'topright' }).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);
      } catch (err: any) {
        if (isMounted) {
          setMapError(err.message || 'Failed to initialize Leaflet map.');
        }
      }
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

  // 2. Render Location Markers with Color-Coded Risk Status
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const renderMarkers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Clear existing attraction markers
      Object.values(markersRef.current).forEach((marker: any) => {
        marker.remove();
      });
      markersRef.current = {};

      filteredLocations.forEach((loc) => {
        const prediction = locationPredictions[loc.id];
        
        // Color coding: Low=Green (#10b981), Medium=Amber (#f59e0b), High=Red (#ef4444), Unavailable=Grey (#94a3b8)
        let pinColor = '#94a3b8'; // default grey (unavailable)
        let ringColor = 'border-slate-400';
        let badgeText = 'Risk assessment unavailable';
        let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';

        if (prediction) {
          if (prediction.risk_label === 'High') {
            pinColor = '#ef4444';
            ringColor = 'border-rose-400 ring-rose-500/30';
            badgeText = `HIGH RISK (${(prediction.confidence * 100).toFixed(0)}%)`;
            badgeBg = 'bg-rose-950 text-rose-300 border-rose-800';
          } else if (prediction.risk_label === 'Medium') {
            pinColor = '#f59e0b';
            ringColor = 'border-amber-400 ring-amber-500/30';
            badgeText = `MEDIUM RISK (${(prediction.confidence * 100).toFixed(0)}%)`;
            badgeBg = 'bg-amber-950 text-amber-300 border-amber-800';
          } else {
            pinColor = '#10b981';
            ringColor = 'border-emerald-400 ring-emerald-500/30';
            badgeText = `LOW RISK (${(prediction.confidence * 100).toFixed(0)}%)`;
            badgeBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
          }
        }

        const isSelected = selectedLocation?.id === loc.id;

        const customIcon = L.divIcon({
          className: 'custom-attraction-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 ${isSelected ? 'scale-125 z-50' : ''}">
              <div class="h-6 w-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white ring-2 ${ringColor}" style="background-color: ${pinColor}">
                <div class="h-2 w-2 rounded-full bg-white"></div>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

        // Bind informative popup
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 space-y-2 text-slate-100 min-w-[220px] font-sans';
        popupContent.innerHTML = `
          <div class="border-b border-navy-700 pb-1.5">
            <span class="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-navy-800 text-cyan-300 border border-navy-700">
              ${loc.categoryLabel}
            </span>
            <h4 class="font-extrabold text-sm text-white mt-1 leading-snug">${loc.name}</h4>
            <p class="text-[10px] text-slate-400 font-mono mt-0.5">${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E</p>
          </div>

          <div class="text-[11px] text-slate-300 leading-snug">
            ${loc.description}
          </div>

          <div class="pt-1">
            <span class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Safety Risk Status:</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badgeBg}">
              ${badgeText}
            </span>
          </div>

          <div class="pt-2 flex flex-col gap-1.5">
            <button id="predict-btn-${loc.id}" class="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 py-1.5 text-[11px] font-bold text-white transition">
              <span>Evaluate Risk via ML</span>
            </button>
            <button id="select-btn-${loc.id}" class="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 py-1.5 text-[11px] font-semibold text-slate-200 border border-navy-700 transition">
              <span>Select This Location</span>
            </button>
          </div>
        `;

        // Wire popup button clicks
        marker.on('popupopen', () => {
          const predictBtn = document.getElementById(`predict-btn-${loc.id}`);
          if (predictBtn) {
            predictBtn.onclick = () => handlePredictLocation(loc);
          }
          const selectBtn = document.getElementById(`select-btn-${loc.id}`);
          if (selectBtn) {
            selectBtn.onclick = () => {
              setSelectedLocation(loc);
              setTouristLocation(loc.lat, loc.lng, loc.name);
              if (onSelectLocation) onSelectLocation(loc);
            };
          }
        });

        marker.on('click', () => {
          setSelectedLocation(loc);
          if (onSelectLocation) onSelectLocation(loc);
        });

        markersRef.current[loc.id] = marker;
      });
    };

    renderMarkers();
  }, [mapReady, filteredLocations, locationPredictions, selectedLocation]);

  // 3. Render Simulated Incident Markers Layer
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const renderIncidents = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      incidentMarkersRef.current.forEach((m) => m.remove());
      incidentMarkersRef.current = [];

      if (!showIncidentsLayer) return;

      incidents.forEach((inc) => {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="h-5 w-5 rounded-md bg-rose-600 flex items-center justify-center shadow-lg border border-white text-[10px] text-white">
              ⚠️
            </div>
          </div>
        `;

        const incIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: iconHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const incMarker = L.marker(inc.location, { icon: incIcon }).addTo(map);

        incMarker.bindPopup(`
          <div class="p-2 space-y-1 font-sans text-xs">
            <div class="flex items-center space-x-1.5 text-rose-400 font-bold">
              <span>⚠️ Incident Report</span>
              <span class="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">SIMULATED (DEMO)</span>
            </div>
            <div class="font-extrabold text-white">${inc.category}</div>
            <div class="text-[11px] text-slate-300">${inc.description}</div>
            <div class="text-[10px] text-slate-400 font-mono">Location: ${inc.locationName}</div>
          </div>
        `);

        incidentMarkersRef.current.push(incMarker);
      });
    };

    renderIncidents();
  }, [mapReady, showIncidentsLayer, incidents]);

  // 4. Request Real ML Risk Prediction for a specific location
  const handlePredictLocation = async (loc: TouristLocation) => {
    setPredictingLocId(loc.id);
    const now = new Date();
    const hour = now.getHours();
    const dow = (now.getDay() + 6) % 7;
    const isWeekend = dow >= 5 ? 1 : 0;

    const telemetry: MLTelemetryInput = {
      latitude: loc.lat,
      longitude: loc.lng,
      hour: hour,
      day_of_week: dow,
      is_weekend: isWeekend,
      crowd_density: 65.0,
      crime_rate: loc.historicalCrimeIndex,
      incident_count: 0,
      police_distance: loc.policeDistanceKm,
      hospital_distance: loc.hospitalDistanceKm,
      weather_condition: 0,
      temperature: 28.0,
      rainfall: 0.0,
      humidity: 65.0,
      tourist_speed: 2.2,
      dwell_time: 30,
      lighting_condition: hour >= 18 || hour <= 5 ? 1 : 0,
      location_type: loc.locationTypeInt,
    };

    try {
      const pred = await predictTouristRisk(telemetry);
      setLocationPredictions((prev) => ({
        ...prev,
        [loc.id]: pred,
      }));
      addToast(
        `ML Risk Evaluated: ${loc.name}`,
        `Predicted: ${pred.risk_label.toUpperCase()} Risk (${(pred.confidence * 100).toFixed(0)}% confidence)`,
        pred.risk_label === 'High' ? 'error' : pred.risk_label === 'Medium' ? 'warning' : 'success'
      );
    } catch (err: any) {
      addToast('ML Service Offline', 'Start Python service via: python ml/service.py', 'error');
    } finally {
      setPredictingLocId(null);
    }
  };

  // 5. Reset to default Kolkata view
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(KOLKATA_DEFAULT_CENTER, KOLKATA_DEFAULT_ZOOM, {
      duration: 1.2,
    });
  };

  // 6. User Geolocation ("Locate Me")
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation Unavailable', 'Your browser does not support GPS geolocation.', 'error');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocatingUser(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);

        if (mapInstanceRef.current) {
          const L = (await import('leaflet')).default;
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });

          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute -inset-2 rounded-full bg-cyan-400/40 animate-ping"></div>
                <div class="h-6 w-6 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-bold">
                  📍
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div class="p-2 font-sans text-xs">
                <span class="font-extrabold text-cyan-400 block">Your Current Location</span>
                <span class="text-[10px] text-slate-400 font-mono">${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</span>
              </div>
            `)
            .openPopup();
        }

        addToast('Location Located', 'Map centered on your current GPS position.', 'success');
      },
      (err) => {
        setLocatingUser(false);
        let msg = 'Could not retrieve your location.';
        if (err.code === 1) msg = 'Location permission was denied. The map will remain centred on Kolkata.';
        else if (err.code === 2) msg = 'GPS position unavailable. Please verify connectivity.';
        addToast('Location Permission', msg, 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // 7. Select a location from search
  const handleSelectSearchResult = (loc: TouristLocation) => {
    setSelectedLocation(loc);
    setSearchQuery('');
    setIsSearchFocused(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 16, { duration: 1.2 });
      const marker = markersRef.current[loc.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1300);
      }
    }
    if (onSelectLocation) onSelectLocation(loc);
  };

  const categories: { key: LocationCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Places' },
    { key: 'attraction', label: 'Attractions' },
    { key: 'market', label: 'Markets' },
    { key: 'transport', label: 'Transit Hubs' },
    { key: 'religious', label: 'Religious' },
    { key: 'park', label: 'Parks & Promenades' },
  ];

  return (
    <div className="space-y-3">
      {/* Map Interactive Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Kolkata attractions (e.g. Victoria Memorial)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full rounded-xl bg-navy-900/90 pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 border border-navy-700 focus:outline-none focus:border-cyan-500 shadow-md transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-[1000] rounded-xl bg-navy-900 border border-navy-700 shadow-2xl max-h-56 overflow-y-auto divide-y divide-navy-800">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectSearchResult(loc)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-cyan-950/60 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.categoryLabel} • {loc.landmark}</div>
                    </div>
                    <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No matching tourist locations found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLocateMe}
            disabled={locatingUser}
            title="Locate my position via browser GPS"
            className="flex items-center space-x-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cyan-300 border border-navy-700 px-3 py-2 text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <Navigation className={`h-3.5 w-3.5 text-cyan-400 ${locatingUser ? 'animate-spin' : ''}`} />
            <span>{locatingUser ? 'Locating...' : 'Locate Me'}</span>
          </button>

          <button
            onClick={handleResetView}
            title="Reset to Kolkata center"
            className="flex items-center space-x-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-navy-700 px-3 py-2 text-xs font-semibold shadow-md transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset View</span>
          </button>

          <button
            onClick={() => setShowIncidentsLayer(!showIncidentsLayer)}
            title="Toggle Simulated Incidents Layer"
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-md transition ${
              showIncidentsLayer 
                ? 'bg-rose-950/60 text-rose-300 border-rose-800' 
                : 'bg-navy-900 text-slate-400 border-navy-700'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Incidents</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition border ${
              activeCategory === cat.key
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                : 'bg-navy-900/80 text-slate-300 border-navy-700 hover:bg-navy-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map Container */}
      <div className="relative overflow-hidden rounded-2xl border border-navy-800 shadow-2xl bg-navy-950" style={{ height }}>
        {/* Loading & Error States */}
        {!mapReady && !mapError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/90 text-cyan-400 space-y-2">
            <RefreshCw className="h-7 w-7 animate-spin" />
            <span className="text-xs font-semibold text-slate-200">Loading OpenStreetMap Kolkata tiles...</span>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950 p-6 text-center text-rose-300 space-y-2">
            <AlertCircle className="h-8 w-8 text-rose-400" />
            <span className="text-sm font-bold">Failed to load interactive map</span>
            <p className="text-xs text-slate-400 max-w-sm">{mapError}</p>
          </div>
        )}

        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Compact Safety Risk Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-[400] rounded-xl bg-navy-950/90 backdrop-blur-md p-2.5 border border-navy-700 shadow-2xl text-[10px] space-y-1.5 max-w-[210px]">
          <div className="font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-navy-800 pb-1">
            <span>Safety Risk Legend</span>
            <span className="text-[9px] text-cyan-400 font-mono">ML Model</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-300">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>High Risk</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400 shrink-0"></span>
              <span>Unevaluated</span>
            </div>
          </div>
          <div className="pt-0.5 text-[8.5px] text-slate-400 border-t border-navy-800">
            Click any pin to predict risk via Random Forest.
          </div>
        </div>
      </div>

      {/* Selected Location Details & ML Inference Inspector Drawer */}
      {showInspector && selectedLocation && (
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-4 shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-300">
                  {selectedLocation.categoryLabel}
                </span>
                <h3 className="font-extrabold text-sm text-white">{selectedLocation.name}</h3>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Location Specs */}
            <div className="space-y-1 text-slate-300">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Landmark & Coordinates</div>
              <p className="font-semibold text-white">{selectedLocation.landmark}</p>
              <p className="font-mono text-[11px] text-slate-400">
                {selectedLocation.lat.toFixed(6)}° N, {selectedLocation.lng.toFixed(6)}° E
              </p>
              <p className="text-[11px] text-slate-300 pt-1">{selectedLocation.description}</p>
            </div>

            {/* Emergency Facilities Proximity */}
            <div className="space-y-1.5 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Safety Proximity Telemetry</div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Nearest Police Post:</span>
                <span className="font-mono font-bold text-white">{selectedLocation.policeDistanceKm} km</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Nearest Hospital:</span>
                <span className="font-mono font-bold text-white">{selectedLocation.hospitalDistanceKm} km</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Relative Crime Index:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedLocation.historicalCrimeIndex}</span>
              </div>
            </div>

            {/* ML Risk Status & Action */}
            <div className="space-y-2 rounded-xl bg-navy-900/80 p-2.5 border border-navy-800 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">ML Model Evaluation</div>
                {locationPredictions[selectedLocation.id] ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-black border ${
                        locationPredictions[selectedLocation.id].risk_label === 'High' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        locationPredictions[selectedLocation.id].risk_label === 'Medium' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {locationPredictions[selectedLocation.id].risk_label.toUpperCase()} RISK
                      </span>
                      <span className="text-[11px] text-slate-300">
                        ({(locationPredictions[selectedLocation.id].confidence * 100).toFixed(0)}% confidence)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Low: {((locationPredictions[selectedLocation.id].probabilities?.Low || 0) * 100).toFixed(0)}% •
                      Med: {((locationPredictions[selectedLocation.id].probabilities?.Medium || 0) * 100).toFixed(0)}% •
                      High: {((locationPredictions[selectedLocation.id].probabilities?.High || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Risk assessment unavailable for this location.
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handlePredictLocation(selectedLocation)}
                  disabled={predictingLocId === selectedLocation.id}
                  className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 py-1.5 text-xs font-bold text-white shadow-md transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${predictingLocId === selectedLocation.id ? 'animate-spin' : ''}`} />
                  <span>{predictingLocId === selectedLocation.id ? 'Evaluating...' : 'Predict via ML'}</span>
                </button>
                <button
                  onClick={() => {
                    setTouristLocation(selectedLocation.lat, selectedLocation.lng, selectedLocation.name);
                    addToast('Current Spot Updated', `Alex Johnson is now at ${selectedLocation.name}`, 'info');
                  }}
                  className="flex items-center justify-center rounded-lg bg-navy-800 hover:bg-navy-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 border border-navy-700 transition"
                  title="Move tourist avatar to this spot"
                >
                  <span>Teleport</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
