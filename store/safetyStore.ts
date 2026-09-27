import { create } from 'zustand';
import { 
  TouristProfile, 
  Incident, 
  EmergencyUnit, 
  GeofenceZone, 
  SafetyAlert, 
  IncidentCategory, 
  RiskLevel,
  CrowdZone,
  AuditEvent,
  ToastMessage,
  AnomalyEvent
} from '@/types';
import { 
  initialTouristProfile, 
  mockGeofences, 
  mockEmergencyUnits, 
  mockIncidents, 
  mockInitialAlerts,
  mockCrowdZones,
  mockAuditEvents
} from '@/services/mockData';
import { calculateTouristRisk, classifyIncident, findOptimalResponseUnit, detectAnomaly } from '@/services/mockAI';
import { evaluateGeofencePosition } from '@/services/geofence';
import { generateIncidentId } from '@/lib/utils';
import { verifyDigitalIdentity } from '@/services/blockchain';

export interface DemoState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  stepMessage: string;
  stepDetails: string;
}

interface SafetyStoreState {
  // Core Entities
  tourist: TouristProfile;
  incidents: Incident[];
  emergencyUnits: EmergencyUnit[];
  geofences: GeofenceZone[];
  alerts: SafetyAlert[];
  crowdZones: CrowdZone[];
  auditEvents: AuditEvent[];
  anomalies: AnomalyEvent[];
  toasts: ToastMessage[];
  
  // Geofence alert popup state for Tourist UI
  activeGeofenceAlert: {
    zone: GeofenceZone;
    reason: string;
    suggestedAction: string;
  } | null;

  // Selected Zone for Map Inspector Modal / Drawer
  selectedZoneForModal: GeofenceZone | null;

  // Selected incident in Authority UI & slideout panel
  selectedIncidentId: string | null;
  isIncidentDetailOpen: boolean;

  // Selected crowd zone for analytics view
  selectedCrowdZoneId: string;

  // Offline Mode State
  isOfflineMode: boolean;
  isOfflineCached: boolean;
  isDownloadingOffline: boolean;
  offlineDownloadProgress: number;

  // Demo Automation State
  demo: DemoState;

  // Active Role switcher state
  activeRole: 'tourist' | 'authority';

  // Actions
  setActiveRole: (role: 'tourist' | 'authority') => void;
  setSelectedIncidentId: (id: string | null) => void;
  setIsIncidentDetailOpen: (open: boolean) => void;
  setSelectedZoneForModal: (zone: GeofenceZone | null) => void;
  setSelectedCrowdZoneId: (id: string) => void;
  setTouristLocation: (lat: number, lng: number, name?: string, address?: string) => void;
  simulateMoveToZone: (zoneType: 'SAFE' | 'CAUTION' | 'HIGH_RISK') => void;
  dismissGeofenceAlert: () => void;
  
  // Toast notifications
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Offline Mode
  downloadOfflineArea: () => Promise<void>;
  toggleOfflineMode: () => void;

  // Geofence Management Actions
  addGeofence: (newZone: Omit<GeofenceZone, 'id' | 'activeIncidentsCount'>) => void;
  updateGeofence: (id: string, updated: Partial<GeofenceZone>) => void;
  toggleGeofenceStatus: (id: string) => void;
  
  // SOS & Incident Actions
  triggerSOS: () => Promise<string>;
  cancelSOS: () => void;
  submitIncidentReport: (category: IncidentCategory, description: string, severity: RiskLevel) => Promise<string>;
  dispatchResponderToIncident: (incidentId: string, unitId?: string) => void;
  resolveIncident: (incidentId: string) => void;
  
  // Digital ID Verification
  verifyDigitalId: () => Promise<boolean>;
  
  // Alerts
  addAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => void;
  markAlertRead: (id: string) => void;
  
  // Privacy & Settings
  toggleSafetyBubble: () => void;
  setPrivacyMode: (mode: 'NORMAL' | 'RISK' | 'EMERGENCY') => void;

  // Presenter Simulation Triggers
  simulateWeatherAlert: () => void;
  simulateCrowdSpike: () => void;

  // Demo Engine Actions
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  resetDemo: () => void;
  setDemoStep: (stepNumber: number) => void;
}

export const useSafetyStore = create<SafetyStoreState>((set, get) => ({
  tourist: initialTouristProfile,
  incidents: mockIncidents,
  emergencyUnits: mockEmergencyUnits,
  geofences: mockGeofences,
  alerts: mockInitialAlerts,
  crowdZones: mockCrowdZones,
  auditEvents: mockAuditEvents,
  anomalies: detectAnomaly(),
  toasts: [],
  activeGeofenceAlert: null,
  selectedZoneForModal: null,
  selectedIncidentId: mockIncidents[0]?.id || null,
  isIncidentDetailOpen: false,
  selectedCrowdZoneId: 'CROWD-Z3', // Zone C default
  activeRole: 'tourist',

  isOfflineMode: false,
  isOfflineCached: false,
  isDownloadingOffline: false,
  offlineDownloadProgress: 0,

  demo: {
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 15,
    stepMessage: 'Ready to run interactive safety simulation',
    stepDetails: 'Click Run Demo to initiate automated end-to-end incident flow.',
  },

  setActiveRole: (role) => set({ activeRole: role }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id, isIncidentDetailOpen: Boolean(id) }),
  setIsIncidentDetailOpen: (open) => set({ isIncidentDetailOpen: open }),
  setSelectedZoneForModal: (zone) => set({ selectedZoneForModal: zone }),
  setSelectedCrowdZoneId: (id) => set({ selectedCrowdZoneId: id }),

  addToast: (title, message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };
    set((state) => ({ toasts: [...state.toasts.slice(-4), newToast] }));

    setTimeout(() => {
      get().dismissToast(id);
    }, 5000);
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  downloadOfflineArea: async () => {
    set({ isDownloadingOffline: true, offlineDownloadProgress: 10 });

    for (let p = 25; p <= 100; p += 25) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      set({ offlineDownloadProgress: p });
    }

    set({ isDownloadingOffline: false, isOfflineCached: true });
    get().addToast('Kolkata Central Offline Package Cached', '42 MB safety map, offline ZK credentials & emergency guides stored securely.', 'success');
  },

  toggleOfflineMode: () => {
    const nextMode = !get().isOfflineMode;
    set((state) => ({
      isOfflineMode: nextMode,
      tourist: {
        ...state.tourist,
        networkStatus: nextMode ? 'OFFLINE' : 'CONNECTED',
      }
    }));
    get().addToast(nextMode ? 'Offline Safety Companion Active' : 'Online Connectivity Restored', nextMode ? 'Essential safety data operating from local cache.' : 'Cloud sync connected.', 'info');
  },

  addGeofence: (newZone) => {
    const id = `GEO-${String(get().geofences.length + 1).padStart(2, '0')}`;
    const created: GeofenceZone = {
      ...newZone,
      id,
      activeIncidentsCount: 0,
      status: 'ACTIVE',
    };
    set((state) => ({ geofences: [created, ...state.geofences] }));
    get().addToast(`Geofence Perimeter Created: ${newZone.name}`, `Security radius of ${newZone.radius}m established with ${newZone.riskLevel} classification.`, 'success');
  },

  updateGeofence: (id, updated) => {
    set((state) => ({
      geofences: state.geofences.map(z => z.id === id ? { ...z, ...updated } : z)
    }));
    get().addToast('Geofence Updated', `Perimeter #${id} modifications applied.`, 'info');
  },

  toggleGeofenceStatus: (id) => {
    set((state) => ({
      geofences: state.geofences.map(z => {
        if (z.id === id) {
          const newStatus = z.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...z, status: newStatus };
        }
        return z;
      })
    }));
  },

  setTouristLocation: (lat, lng, name, address) => {
    const { geofences, incidents, tourist } = get();
    const geofenceResult = evaluateGeofencePosition(lat, lng, geofences);
    
    // Count incidents within 1km
    const nearbyIncidentsCount = incidents.filter(inc => {
      const dLat = inc.location[0] - lat;
      const dLng = inc.location[1] - lng;
      return Math.sqrt(dLat * dLat + dLng * dLng) < 0.01;
    }).length;

    const newSafetyScore = calculateTouristRisk(
      lat,
      lng,
      geofenceResult.isInsideCaution,
      geofenceResult.isInsideHighRisk || geofenceResult.isInsideEmergency,
      tourist.sosActive,
      nearbyIncidentsCount
    );

    const prevScore = tourist.safetyScore.score;
    const locationName = name || (geofenceResult.currentZone ? geofenceResult.currentZone.name : 'Central Kolkata');
    const locationAddress = address || `${locationName}, Kolkata, West Bengal`;

    let geofenceAlert = get().activeGeofenceAlert;
    if (geofenceResult.currentZone && (geofenceResult.isInsideCaution || geofenceResult.isInsideHighRisk || geofenceResult.isInsideEmergency)) {
      geofenceAlert = {
        zone: geofenceResult.currentZone,
        reason: geofenceResult.suggestedAction || 'Approaching monitored boundary zone.',
        suggestedAction: geofenceResult.activeAdvisory || 'Maintain awareness and follow safe route.',
      };
    } else {
      geofenceAlert = null;
    }

    if (Math.abs(prevScore - newSafetyScore.score) >= 5) {
      get().addToast(
        `Safety Score Updated: ${prevScore} → ${newSafetyScore.score}`,
        newSafetyScore.score < prevScore ? 'Risk level elevated due to location transition.' : 'Safety score normalized.',
        newSafetyScore.score < 75 ? 'warning' : 'success'
      );
    }

    set((state) => ({
      tourist: {
        ...state.tourist,
        currentLocation: {
          lat,
          lng,
          name: locationName,
          address: locationAddress,
        },
        safetyScore: newSafetyScore,
        privacyMode: state.tourist.sosActive ? 'EMERGENCY' : geofenceResult.isInsideHighRisk ? 'RISK' : 'NORMAL',
      },
      activeGeofenceAlert: geofenceAlert,
    }));
  },

  simulateMoveToZone: (zoneType) => {
    if (zoneType === 'SAFE') {
      get().setTouristLocation(22.5535, 88.3524, 'Park Street Main Tourist Corridor', 'Park Street, Kolkata');
    } else if (zoneType === 'CAUTION') {
      get().setTouristLocation(22.5645, 88.3520, 'Esplanade Transit Hub', 'Esplanade Underground Plaza, Kolkata');
    } else {
      get().setTouristLocation(22.5684, 88.3615, 'Bowbazar Construction Zone', 'Bowbazar Arterial Lane, Kolkata');
    }
  },

  dismissGeofenceAlert: () => set({ activeGeofenceAlert: null }),

  triggerSOS: async () => {
    const { tourist, emergencyUnits } = get();
    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const incidentId = generateIncidentId();
    
    // Find optimal responder
    const matchedUnit = findOptimalResponseUnit(
      tourist.currentLocation.lat,
      tourist.currentLocation.lng,
      emergencyUnits,
      'Medical Emergency'
    ) || emergencyUnits[0];

    const newIncident: Incident = {
      id: incidentId,
      touristId: tourist.digitalId.idNumber,
      touristName: tourist.name,
      category: 'Medical Emergency',
      severity: 'CRITICAL',
      status: 'Dispatched',
      location: [tourist.currentLocation.lat, tourist.currentLocation.lng],
      locationName: tourist.currentLocation.name,
      description: `EMERGENCY SOS TRIGGERED by Tourist (${tourist.name}, ID: ${tourist.digitalId.idNumber}). Immediate intervention requested at ${tourist.currentLocation.name}.`,
      timestamp: nowIso,
      timeAgo: 'Just now',
      isSOS: true,
      digitalIdVerified: true,
      aiClassification: {
        category: 'Critical SOS / Immediate Danger',
        confidence: 0.99,
        riskScore: 99,
        recommendedAction: `Dispatch ${matchedUnit.callSign} (ETA ${matchedUnit.etaMinutes || 2} min) and activate hospital trauma pre-alert.`,
        priority: 'P1',
        automatedSummary: 'Automated SOS with instant cryptographic digital ID authentication and live GPS telemetry broadcast.',
        factors: ['Direct panic signal', 'Heart rate telemetry trigger', 'Unlit street segment'],
      },
      assignedUnit: {
        ...matchedUnit,
        status: 'Dispatched',
        assignedIncidentId: incidentId,
      },
      timeline: [
        { time: timeStr, event: 'SOS activated by tourist Alex Johnson', actor: 'Tourist Device', completed: true },
        { time: timeStr, event: `Digital ID ${tourist.digitalId.idNumber} verified on-chain`, actor: 'Gov-Subnet Node', completed: true },
        { time: timeStr, event: 'AI Threat Assessment classified as CRITICAL (Confidence 99%)', actor: 'AI Engine', completed: true },
        { time: timeStr, event: `Emergency Unit ${matchedUnit.callSign} dispatched (ETA ${matchedUnit.etaMinutes || 2}m)`, actor: 'Command Center', completed: true },
        { time: timeStr, event: 'Emergency contact Sarah Johnson notified via SMS/Push', actor: 'Notification Hub', completed: true },
      ],
    };

    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      timestamp: `${timeStr} IST`,
      event: `SOS Activated by Tourist ${tourist.digitalId.idNumber}`,
      actor: 'Tourist App (Alex Johnson)',
      details: `Emergency signal at [${tourist.currentLocation.lat.toFixed(4)}, ${tourist.currentLocation.lng.toFixed(4)}]. Unit ${matchedUnit.callSign} assigned.`,
      category: 'SOS',
      txHash: '0x8f23...a9b1',
    };

    get().addToast('🚨 EMERGENCY SOS ACTIVE', `Signal received by Kolkata Command Center. ${matchedUnit.callSign} dispatched (ETA: ${matchedUnit.etaMinutes || 2} min).`, 'sos');

    set((state) => ({
      tourist: {
        ...state.tourist,
        sosActive: true,
        activeSosIncidentId: incidentId,
        privacyMode: 'EMERGENCY',
        safetyScore: calculateTouristRisk(
          state.tourist.currentLocation.lat,
          state.tourist.currentLocation.lng,
          false,
          false,
          true,
          0
        ),
      },
      incidents: [newIncident, ...state.incidents],
      selectedIncidentId: incidentId,
      isIncidentDetailOpen: true,
      auditEvents: [newAuditEvent, ...state.auditEvents],
      emergencyUnits: state.emergencyUnits.map(u => 
        u.id === matchedUnit.id ? { ...u, status: 'Dispatched', assignedIncidentId: incidentId } : u
      ),
      alerts: [
        {
          id: `ALT-SOS-${Date.now()}`,
          title: '🚨 SOS BROADCAST ACTIVE',
          message: `Your emergency signal has been received by Command Center. ${matchedUnit.callSign} is dispatched (ETA: ${matchedUnit.etaMinutes || 2} mins).`,
          type: 'Emergency',
          severity: 'CRITICAL',
          timestamp: nowIso,
          location: state.tourist.currentLocation.name,
          reason: 'Direct SOS Trigger by Tourist Device',
          recommendedAction: 'Stay at your current location or inside nearest well-lit venue. Help is arriving.',
          read: false,
          timeGroup: 'NOW',
        },
        ...state.alerts,
      ]
    }));

    return incidentId;
  },

  cancelSOS: () => {
    get().addToast('SOS Emergency Cancelled', 'Privacy barrier restored to Normal Mode.', 'info');
    set((state) => ({
      tourist: {
        ...state.tourist,
        sosActive: false,
        activeSosIncidentId: undefined,
        privacyMode: 'NORMAL',
        safetyScore: calculateTouristRisk(
          state.tourist.currentLocation.lat,
          state.tourist.currentLocation.lng,
          false,
          false,
          false,
          0
        ),
      }
    }));
  },

  submitIncidentReport: async (category, description, severity) => {
    const { tourist, emergencyUnits } = get();
    const incidentId = generateIncidentId();
    const nowIso = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const aiAssessment = classifyIncident(category, description, severity);
    const matchedUnit = findOptimalResponseUnit(
      tourist.currentLocation.lat,
      tourist.currentLocation.lng,
      emergencyUnits,
      category
    ) || emergencyUnits[0];

    const newIncident: Incident = {
      id: incidentId,
      touristId: tourist.digitalId.idNumber,
      touristName: tourist.name,
      category,
      severity,
      status: 'Analyzing',
      location: [tourist.currentLocation.lat, tourist.currentLocation.lng],
      locationName: tourist.currentLocation.name,
      description,
      timestamp: nowIso,
      timeAgo: 'Just now',
      isSOS: false,
      digitalIdVerified: tourist.digitalId.status === 'VERIFIED',
      aiClassification: aiAssessment,
      timeline: [
        { time: timeStr, event: `Incident filed: ${category}`, actor: `Tourist ${tourist.name}`, completed: true },
        { time: timeStr, event: `AI classification: ${aiAssessment.category} (${Math.round(aiAssessment.confidence * 100)}%)`, actor: 'AI Risk Engine', completed: true },
        { time: timeStr, event: 'Queued for Command Center Dispatch review', actor: 'Operations System', completed: true },
      ],
    };

    get().addToast(`Incident #${incidentId} Logged`, `AI assessed as ${severity} risk (${Math.round(aiAssessment.confidence * 100)}% confidence).`, 'warning');

    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      selectedIncidentId: incidentId,
      alerts: [
        {
          id: `ALT-INC-${Date.now()}`,
          title: `INCIDENT LOGGED: ${category.toUpperCase()}`,
          message: `Your incident report (#${incidentId}) has been received and analyzed by AI Safety Hub.`,
          type: 'Incident',
          severity: severity,
          timestamp: nowIso,
          location: state.tourist.currentLocation.name,
          reason: description,
          recommendedAction: aiAssessment.recommendedAction,
          read: false,
          timeGroup: 'NOW',
        },
        ...state.alerts,
      ]
    }));

    return incidentId;
  },

  dispatchResponderToIncident: (incidentId, unitId) => {
    const { emergencyUnits, incidents } = get();
    const targetIncident = incidents.find(i => i.id === incidentId);
    if (!targetIncident) return;

    const unitToAssign = unitId 
      ? emergencyUnits.find(u => u.id === unitId) 
      : (targetIncident.assignedUnit || emergencyUnits[0]);

    if (!unitToAssign) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    get().addToast(`Responder Dispatched: ${unitToAssign.callSign}`, `Siren CAD telemetry acknowledged. ETA: ${unitToAssign.etaMinutes || 2} min.`, 'info');

    set((state) => ({
      incidents: state.incidents.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Dispatched',
            assignedUnit: { ...unitToAssign, status: 'Dispatched' },
            timeline: [
              ...inc.timeline,
              { time: timeStr, event: `Responder ${unitToAssign.callSign} dispatched to scene`, actor: 'Dispatch Officer', completed: true }
            ]
          };
        }
        return inc;
      }),
      emergencyUnits: state.emergencyUnits.map(u => 
        u.id === unitToAssign.id ? { ...u, status: 'Dispatched', assignedIncidentId: incidentId } : u
      )
    }));
  },

  resolveIncident: (incidentId) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const { tourist } = get();

    get().addToast(`Incident #${incidentId} Resolved`, 'On-scene responder confirmed safety restoration.', 'success');

    set((state) => {
      const isCurrentSos = tourist.activeSosIncidentId === incidentId || (tourist.sosActive && state.incidents.find(i => i.id === incidentId)?.isSOS);
      
      return {
        incidents: state.incidents.map(inc => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: 'Resolved',
              timeline: [
                ...inc.timeline,
                { time: timeStr, event: 'Incident marked RESOLVED on scene', actor: 'Command Center Officer', completed: true }
              ]
            };
          }
          return inc;
        }),
        tourist: isCurrentSos ? {
          ...state.tourist,
          sosActive: false,
          activeSosIncidentId: undefined,
          privacyMode: 'NORMAL',
          safetyScore: calculateTouristRisk(
            state.tourist.currentLocation.lat,
            state.tourist.currentLocation.lng,
            false,
            false,
            false,
            0
          ),
        } : state.tourist,
      };
    });
  },

  verifyDigitalId: async () => {
    const { tourist } = get();
    const result = await verifyDigitalIdentity(tourist.digitalId.idNumber);
    
    get().addToast('Digital Tourist ID Cryptographically Verified', `Merkle root match confirmed on Gov-Polygon Subnet (Block #${result.blockNumber}).`, 'success');

    set((state) => ({
      tourist: {
        ...state.tourist,
        digitalId: {
          ...state.tourist.digitalId,
          status: 'VERIFIED',
          identityHash: result.identityHash,
          blockNumber: result.blockNumber,
          verifiedTimestamp: result.timestamp,
        }
      }
    }));

    return true;
  },

  addAlert: (alert) => {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `ALT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      timeGroup: 'NOW',
    };
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
    get().addToast(alert.title, alert.message, alert.severity === 'HIGH' || alert.severity === 'CRITICAL' ? 'warning' : 'info');
  },

  markAlertRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
    }));
  },

  toggleSafetyBubble: () => {
    const nextState = !get().tourist.invisibleSafetyBubbleActive;
    get().addToast(nextState ? 'Invisible Safety Bubble Enabled' : 'Safety Bubble Disabled', nextState ? '180m radius environmental risk monitoring active.' : 'Edge risk scanning paused.', 'info');
    set((state) => ({
      tourist: {
        ...state.tourist,
        invisibleSafetyBubbleActive: nextState,
      }
    }));
  },

  setPrivacyMode: (mode) => {
    get().addToast(`Privacy Mode Changed: ${mode}`, mode === 'NORMAL' ? 'Location restricted to edge.' : mode === 'RISK' ? 'Escalation prompts active.' : 'Full emergency telemetry sharing.', 'info');
    set((state) => ({
      tourist: {
        ...state.tourist,
        privacyMode: mode,
      }
    }));
  },

  simulateWeatherAlert: () => {
    get().addAlert({
      title: 'WEATHER ALERT: MONSOON SQUALL',
      message: 'Sudden high-velocity precipitation approaching central promenade in 20 minutes.',
      type: 'Weather',
      severity: 'MODERATE',
      location: 'Central Kolkata District',
      reason: 'Bay of Bengal localized cloud mass detected by IMD Doppler radar.',
      recommendedAction: 'Move to covered colonnades along Park Street or Victoria Memorial South Pavilion.',
    });
  },

  simulateCrowdSpike: () => {
    get().addAlert({
      title: 'CROWD SPIKE: ESPLANADE PLAZA',
      message: 'Pedestrian density surged to 94% due to special cultural transit interchange.',
      type: 'Crowd',
      severity: 'HIGH',
      location: 'Esplanade Plaza',
      reason: 'Vision AI camera stream #14 flagged severe congestion.',
      recommendedAction: 'Divert toward Middleton Row green corridor for 50% faster, low-density walking.',
    });
  },

  // Demo actions
  startDemo: () => {
    set({
      demo: {
        isPlaying: true,
        isPaused: false,
        currentStep: 1,
        totalSteps: 15,
        stepMessage: 'Step 1: Tourist entering caution geofence zone',
        stepDetails: 'Simulating GPS movement to Bowbazar / Esplanade caution boundary.',
      }
    });
    get().setDemoStep(1);
  },

  pauseDemo: () => set((state) => ({ demo: { ...state.demo, isPaused: true } })),
  resumeDemo: () => set((state) => ({ demo: { ...state.demo, isPaused: false } })),
  
  resetDemo: () => {
    set({
      tourist: initialTouristProfile,
      incidents: mockIncidents,
      emergencyUnits: mockEmergencyUnits,
      alerts: mockInitialAlerts,
      activeGeofenceAlert: null,
      selectedIncidentId: mockIncidents[0]?.id || null,
      isIncidentDetailOpen: false,
      demo: {
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 15,
        stepMessage: 'Simulation Reset',
        stepDetails: 'System restored to baseline demo state.',
      }
    });
    get().addToast('Demo State Reset', 'Restored to baseline demo environment.', 'info');
  },

  setDemoStep: (stepNumber) => {
    const { emergencyUnits } = get();

    switch (stepNumber) {
      case 1:
        // Step 1: Tourist enters elevated-risk geofence
        get().setTouristLocation(22.5684, 88.3615, 'Bowbazar Construction Corridor', 'Bowbazar, Central Kolkata');
        set({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 1,
            totalSteps: 15,
            stepMessage: 'STEP 1: Tourist Enters Elevated-Risk Geofence',
            stepDetails: 'Tourist Alex Johnson crosses boundary into Bowbazar Construction & Heritage Reconstruction Zone.',
          }
        });
        break;

      case 2:
        // Step 2: Safety score decreases (82 -> 72)
        set((state) => ({
          tourist: {
            ...state.tourist,
            safetyScore: {
              ...state.tourist.safetyScore,
              score: 72,
              riskLevel: 'MODERATE',
              factors: {
                ...state.tourist.safetyScore.factors,
                environmental: { score: 60, label: 'Low lighting in construction sector', status: 'Caution' },
                locationRisk: { label: 'Inside Caution Geofence', score: 60, status: 'Caution' },
                crimeRisk: { label: 'Elevated Incident Proximity', score: 65, status: 'Moderate' },
              },
              recommendation: 'Risk index elevated from 82 to 72. Consider the alternate route through Middleton Row.',
            }
          },
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 2,
            totalSteps: 15,
            stepMessage: 'STEP 2: Safety Score Dynamically Decreases (82 → 72)',
            stepDetails: 'AI Risk Engine recalculates score factoring in low lighting, construction excavation, and hazard telemetry.',
          }
        }));
        get().addToast('Safety Score Changed: 82 → 72', 'You entered a moderate-risk caution zone.', 'warning');
        break;

      case 3:
        // Step 3: Geofence alert appears
        set((state) => ({
          activeGeofenceAlert: {
            zone: mockGeofences[7] || mockGeofences[0], // Bowbazar
            reason: 'Low pedestrian activity + ongoing construction excavation + reduced visibility.',
            suggestedAction: 'Take illuminated detour via BB Ganguly Street.',
          },
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 3,
            totalSteps: 15,
            stepMessage: 'STEP 3: Geofence Alert Displayed on Device',
            stepDetails: 'Autonomous geofencing trigger fires modal alert on tourist device.',
          }
        }));
        break;

      case 4:
        // Step 4: AI recommends safer route
        set((state) => ({
          tourist: {
            ...state.tourist,
            safetyScore: {
              ...state.tourist.safetyScore,
              alternativeRouteAvailable: true,
              alternativeRouteSummary: 'Divert East to Central Avenue (adds 2 mins, 92% safe green corridor)',
            }
          },
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 4,
            totalSteps: 15,
            stepMessage: 'STEP 4: AI Proactively Computes Safe Bypass Route',
            stepDetails: 'Dynamic green corridor suggested avoiding dark alleyways.',
          }
        }));
        get().addToast('AI Route Shield Recommendation', 'Alternate bypass route calculated via Central Avenue.', 'info');
        break;

      case 5:
        // Step 5: Incident occurs
        set({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 5,
            totalSteps: 15,
            stepMessage: 'STEP 5: Simulated Medical / Safety Incident Occurs',
            stepDetails: 'Tourist encounters sudden heat distress or confrontation in isolated section.',
          }
        });
        break;

      case 6:
        // Step 6: SOS activates
        get().triggerSOS();
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 6,
            totalSteps: 15,
            stepMessage: 'STEP 6: Emergency SOS Activated by Tourist',
            stepDetails: 'One-touch SOS initiates emergency protocol and overrides privacy barrier.',
          }
        }));
        break;

      case 7:
        // Step 7: Digital ID verified
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 7,
            totalSteps: 15,
            stepMessage: 'STEP 7: Digital Tourist ID Cryptographically Verified',
            stepDetails: 'Zero-Knowledge proof confirmed on Gov-Subnet (ST-IND-2026-004281).',
          }
        }));
        break;

      case 8:
        // Step 8: Emergency location sharing activates
        set((state) => ({
          tourist: { ...state.tourist, privacyMode: 'EMERGENCY' },
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 8,
            totalSteps: 15,
            stepMessage: 'STEP 8: Emergency Live Location Stream Activated',
            stepDetails: 'Precise GPS coordinates (22.5684° N, 88.3615° E) transmitted to Command Center.',
          }
        }));
        break;

      case 9:
        // Step 9: AI analyzes incident
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 9,
            totalSteps: 15,
            stepMessage: 'STEP 9: AI Classification Completed (Confidence 99%)',
            stepDetails: 'Classified as Priority P1 Emergency requiring immediate tactical response.',
          }
        }));
        break;

      case 10:
        // Step 10: Authority receives incident
        set((state) => ({
          activeRole: 'authority',
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 10,
            totalSteps: 15,
            stepMessage: 'STEP 10: Authority Dashboard Alerts Flashing',
            stepDetails: 'EOC Command Center receives live critical incident banner, CAD ticket and map ping.',
          }
        }));
        break;

      case 11:
        // Step 11: Nearest responder selected
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 11,
            totalSteps: 15,
            stepMessage: 'STEP 11: Optimal Responder Selected (Unit P-17)',
            stepDetails: 'Police Response Unit P-17 identified (Distance: 0.35 km, ETA: 2 min).',
          }
        }));
        break;

      case 12:
        // Step 12: Responder dispatched
        const activeSosInc = get().incidents.find(i => i.isSOS);
        if (activeSosInc) {
          get().dispatchResponderToIncident(activeSosInc.id, 'UNIT-P17');
        }
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 12,
            totalSteps: 15,
            stepMessage: 'STEP 12: Unit P-17 Dispatched & En Route',
            stepDetails: 'Dispatcher approves dispatch. Siren navigation transmitted to patrol vehicle.',
          }
        }));
        break;

      case 13:
        // Step 13: Tourist receives response status
        set((state) => ({
          activeRole: 'tourist',
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 13,
            totalSteps: 15,
            stepMessage: 'STEP 13: Tourist Receives Live ETA & Responder Telemetry',
            stepDetails: 'Alex sees "Police Response Unit P-17 DISPATCHED • ETA 2 min" with direct line.',
          }
        }));
        break;

      case 14:
        // Step 14: Incident resolved
        const activeInc = get().incidents.find(i => i.isSOS);
        if (activeInc) {
          get().resolveIncident(activeInc.id);
        }
        set((state) => ({
          demo: {
            isPlaying: true,
            isPaused: false,
            currentStep: 14,
            totalSteps: 15,
            stepMessage: 'STEP 14: Incident Resolved on Scene',
            stepDetails: 'Patrol unit arrives, situation neutralized, tourist safely escorted.',
          }
        }));
        break;

      case 15:
        // Step 15: Audit trail created & Tourist safely guided
        set((state) => ({
          demo: {
            isPlaying: false,
            isPaused: false,
            currentStep: 15,
            totalSteps: 15,
            stepMessage: 'STEP 15: Audit Trail Logged • Tourist Safely Guided',
            stepDetails: 'End-to-end incident lifecycle closed with immutable cryptographic CAD audit record.',
          }
        }));
        get().addToast('Simulation Complete: Tourist Safely Guided', 'Total response time: 4m 18s • AI confidence: 94% • Unit: P-17.', 'success');
        break;

      default:
        break;
    }
  }
}));
