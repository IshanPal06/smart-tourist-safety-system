export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export type IncidentCategory = 
  | 'Theft'
  | 'Harassment'
  | 'Medical Emergency'
  | 'Accident'
  | 'Suspicious Activity'
  | 'Lost Person'
  | 'Fire'
  | 'Unsafe Area'
  | 'Other';

export type IncidentStatus = 
  | 'New'
  | 'Analyzing'
  | 'Dispatched'
  | 'Responding'
  | 'Resolved';

export type UnitType = 'Police' | 'Ambulance' | 'Tourist Police' | 'Disaster Relief' | 'Medical First Responder';

export type UnitStatus = 'Available' | 'Dispatched' | 'En Route' | 'On Scene' | 'Busy';

export interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
  landmark?: string;
  address?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'EMERGENCY';
  riskLevel: RiskLevel;
  center: [number, number];
  radius: number; // in meters
  polygon?: [number, number][];
  description: string;
  activeIncidentsCount: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  advisory: string;
  status?: 'ACTIVE' | 'INACTIVE';
  nearestPoliceUnit?: string;
  nearestHospital?: string;
  predictedRisk?: RiskLevel;
  aiRecommendation?: string;
}

export interface EmergencyUnit {
  id: string;
  callSign: string;
  type: UnitType;
  location: [number, number];
  locationName: string;
  status: UnitStatus;
  distanceKm?: number;
  etaMinutes?: number;
  assignedIncidentId?: string;
  contactNumber: string;
  speedKmh?: number;
}

export interface Incident {
  id: string;
  touristId: string;
  touristName: string;
  category: IncidentCategory;
  severity: RiskLevel;
  status: IncidentStatus;
  location: [number, number];
  locationName: string;
  description: string;
  timestamp: string;
  timeAgo?: string;
  aiClassification?: {
    category: string;
    confidence: number;
    riskScore: number;
    recommendedAction: string;
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    automatedSummary: string;
    factors?: string[];
  };
  assignedUnit?: EmergencyUnit;
  timeline: {
    time: string;
    event: string;
    actor: string;
    completed: boolean;
  }[];
  isSOS?: boolean;
  digitalIdVerified?: boolean;
}

export interface SafetyScoreData {
  riskLevel: RiskLevel;
  score: number; // 0 - 100
  confidence: number;
  factors: {
    environmental: { score: number; label: string; status: 'Optimal' | 'Caution' | 'Adverse' };
    crowdDensity: { label: string; score: number; status: 'Low' | 'Moderate' | 'High' | 'Surging' };
    weatherRisk: { label: string; score: number; status: 'Clear' | 'Moderate' | 'Adverse' | 'Storm' };
    crimeRisk: { label: string; score: number; status: 'Minimal' | 'Moderate' | 'Elevated' | 'Severe' };
    locationRisk: { label: string; score: number; status: 'Verified Safe' | 'Caution' | 'High Risk' };
    recentIncidentsCount: number;
  };
  recommendation: string;
  alternativeRouteAvailable: boolean;
  alternativeRouteSummary?: string;
}

export interface EnvironmentalConditions {
  temperature: number; // in °C
  rainProbability: number; // %
  visibilityKm: number; // in km
  windSpeedKmh: number; // in km/h
  weatherRisk: RiskLevel;
  lastUpdated: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  message: string;
  type: 'Weather' | 'Crowd' | 'Geofence' | 'Incident' | 'Emergency' | 'System';
  severity: RiskLevel;
  timestamp: string;
  location: string;
  coordinates?: [number, number];
  reason: string;
  recommendedAction: string;
  read?: boolean;
  timeGroup?: 'NOW' | 'EARLIER TODAY' | 'RESOLVED';
}

export interface DigitalTouristID {
  idNumber: string;
  holderName: string;
  nationality: string;
  passportHash: string;
  issueDate: string;
  expiryDate: string;
  status: 'VERIFIED' | 'PENDING' | 'REVOKED';
  identityHash: string;
  contractAddress: string;
  blockchainNetwork: string;
  blockNumber: number;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  hotelAccommodation: string;
  bloodGroup: string;
  verifiedTimestamp: string;
}

export interface TouristProfile {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  email: string;
  currentLocation: LocationPoint;
  safetyScore: SafetyScoreData;
  digitalId: DigitalTouristID;
  privacyMode: 'NORMAL' | 'RISK' | 'EMERGENCY';
  sosActive: boolean;
  activeSosIncidentId?: string;
  batteryLevel: number;
  networkStatus: 'CONNECTED' | 'REDUCED' | 'OFFLINE';
  invisibleSafetyBubbleActive: boolean;
  environmentalConditions: EnvironmentalConditions;
  behaviorRiskProfile: {
    routeSafety: 'Low' | 'Moderate' | 'High';
    nightTravel: 'Low' | 'Moderate' | 'High';
    crowdExposure: 'Low' | 'Moderate' | 'High';
    remoteAreas: 'Low' | 'Moderate' | 'Elevated';
    recommendations: string[];
  };
}

export interface CrowdZone {
  id: string;
  code: string;
  name: string;
  densityPercent: number;
  predictedDensityPercent: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  touristCount: number;
  recentIncidents: number;
  recommendation: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface AnomalyEvent {
  id: string;
  zone: string;
  type: 'Crowd Spike' | 'Incident Cluster' | 'Route Deviation' | 'Unusual Density' | 'Environmental Hazard';
  severity: RiskLevel;
  confidence: number;
  detectedAgo: string;
  recommendation: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  details: string;
  category: 'SOS' | 'CAD Dispatch' | 'Identity Verification' | 'Geofence Breach' | 'AI Triage' | 'Resolution';
  txHash?: string;
}

export interface ExternalFeedStatus {
  id: string;
  name: string;
  status: 'CONNECTED' | 'SYNCING' | 'REDUCED';
  updatedAgo: string;
  type: 'Weather' | 'Crowd' | 'CAD / Police' | 'Incident Data' | 'CCTV Stream' | 'Tourist Edge';
  latencyMs: number;
  recordsCount: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'sos';
  timestamp: number;
}
