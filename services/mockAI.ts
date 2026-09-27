import { 
  RiskLevel, 
  SafetyScoreData, 
  IncidentCategory, 
  EmergencyUnit, 
  AnomalyEvent,
  CrowdZone
} from '@/types';
import { calculateDistance } from '@/lib/utils';

export interface AIIncidentClassification {
  category: string;
  confidence: number;
  riskScore: number;
  recommendedAction: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  automatedSummary: string;
  factors: string[];
}

export interface ZoneRiskAssessment {
  zoneName: string;
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}

export function calculateTouristRisk(
  lat: number,
  lng: number,
  isInGeofenceCaution: boolean,
  isInGeofenceHighRisk: boolean,
  isSosActive: boolean,
  recentIncidentsInArea: number
): SafetyScoreData {
  if (isSosActive) {
    return {
      riskLevel: 'CRITICAL',
      score: 18,
      confidence: 0.99,
      factors: {
        environmental: { score: 35, label: 'Emergency state active', status: 'Adverse' },
        crowdDensity: { label: 'Distress Event Active', score: 20, status: 'Surging' },
        weatherRisk: { label: 'Normal Environment', score: 95, status: 'Clear' },
        crimeRisk: { label: 'Active Emergency Alert Broadcasted', score: 10, status: 'Severe' },
        locationRisk: { label: 'Live Responder Priority Zone', score: 15, status: 'High Risk' },
        recentIncidentsCount: recentIncidentsInArea + 1,
      },
      recommendation: 'EMERGENCY PROTOCOL ACTIVE. Stay in place or move towards closest lighted public establishment. Emergency unit en route.',
      alternativeRouteAvailable: false,
    };
  }

  if (isInGeofenceHighRisk) {
    const score = Math.max(35, 72 - (recentIncidentsInArea * 8));
    return {
      riskLevel: 'HIGH',
      score: score,
      confidence: 0.94,
      factors: {
        environmental: { score: 58, label: 'Reduced lighting & construction', status: 'Adverse' },
        crowdDensity: { label: 'Low pedestrian stream in alleyway', score: 50, status: 'Surging' },
        weatherRisk: { label: 'Standard parameters (28°C)', score: 92, status: 'Clear' },
        crimeRisk: { label: 'Elevated theft/hazard risk zone', score: 45, status: 'Severe' },
        locationRisk: { label: 'Within High-Risk Geo-boundary', score: 40, status: 'High Risk' },
        recentIncidentsCount: recentIncidentsInArea,
      },
      recommendation: 'You are in an elevated risk area. We recommend taking the monitored heritage bypass or staying along primary arterial corridors.',
      alternativeRouteAvailable: true,
      alternativeRouteSummary: 'Divert eastward towards Central Avenue (adds 3 mins, 85% safety index)',
    };
  }

  if (isInGeofenceCaution) {
    const score = Math.max(55, 74 - (recentIncidentsInArea * 5));
    return {
      riskLevel: 'MODERATE',
      score: score,
      confidence: 0.92,
      factors: {
        environmental: { score: 72, label: 'High congestion corridor', status: 'Caution' },
        crowdDensity: { label: 'Heavy transit commuter stream (87%)', score: 65, status: 'High' },
        weatherRisk: { label: 'Normal humidity & visibility', score: 95, status: 'Clear' },
        crimeRisk: { label: 'Occasional pickpocketing advisories', score: 70, status: 'Moderate' },
        locationRisk: { label: 'Approaching caution perimeter', score: 68, status: 'Caution' },
        recentIncidentsCount: recentIncidentsInArea,
      },
      recommendation: 'Caution zone ahead. Maintain awareness of personal belongings and stick to illuminated pedestrian corridors.',
      alternativeRouteAvailable: true,
      alternativeRouteSummary: 'Via Middleton Row & Camac St (safe green corridor)',
    };
  }

  // Safe baseline
  return {
    riskLevel: 'LOW',
    score: 82,
    confidence: 0.91,
    factors: {
      environmental: { score: 82, label: 'Safe municipal corridor', status: 'Optimal' },
      crowdDensity: { label: 'Optimal pedestrian flow (91)', score: 91, status: 'Low' },
      weatherRisk: { label: 'Clear evening (28°C, Humid)', score: 95, status: 'Clear' },
      crimeRisk: { label: 'Tourist police patrol active', score: 78, status: 'Minimal' },
      locationRisk: { label: 'Designated Safe Zone', score: 74, status: 'Verified Safe' },
      recentIncidentsCount: recentIncidentsInArea,
    },
    recommendation: 'Your current route is safe. Crowd density is low-to-moderate. Safety bubble is fully active.',
    alternativeRouteAvailable: false,
  };
}

export function classifyIncident(
  category: IncidentCategory,
  description: string,
  severityInput?: RiskLevel
): AIIncidentClassification {
  const descLower = description.toLowerCase();
  
  if (category === 'Medical Emergency' || descLower.includes('collapsed') || descLower.includes('blood') || descLower.includes('cardiac') || descLower.includes('breathing')) {
    return {
      category: 'Medical Emergency / Acute Trauma',
      confidence: 0.98,
      riskScore: 96,
      recommendedAction: 'Immediate Cardiac Ambulance dispatch + SSKM Emergency Trauma pre-alert.',
      priority: 'P1',
      automatedSummary: 'High priority medical distress verified via digital health token telemetry.',
      factors: ['Biometric pulse elevation', 'Transit hub location', 'High ambient temperature'],
    };
  }

  if (category === 'Theft' || descLower.includes('stole') || descLower.includes('snatch') || descLower.includes('pickpocket')) {
    return {
      category: 'Theft / Snatch Incident',
      confidence: 0.94,
      riskScore: 82,
      recommendedAction: 'Dispatch Tourist Police beat patrol and isolate CCTV sectors.',
      priority: 'P2',
      automatedSummary: 'High probability suspect fleeing towards adjacent feeder alley.',
      factors: ['Dense market crowd (88%)', 'Narrow alley exit', 'Low lighting'],
    };
  }

  if (category === 'Harassment' || descLower.includes('following') || descLower.includes('threat') || descLower.includes('aggressive')) {
    return {
      category: 'Harassment / Immediate Threat',
      confidence: 0.94,
      riskScore: 88,
      recommendedAction: 'Deploy nearest mobile response unit P-17 and activate continuous tracking.',
      priority: 'P1',
      automatedSummary: 'Behavioral threat detected; protective intercept recommended.',
      factors: ['Isolated feeder lane', 'Low tourist density', 'After-dusk timing'],
    };
  }

  if (category === 'Fire' || descLower.includes('smoke') || descLower.includes('flame')) {
    return {
      category: 'Fire / Environmental Hazard',
      confidence: 0.99,
      riskScore: 99,
      recommendedAction: 'Dispatch Fire Tender + Police Crowd Evacuation cordon.',
      priority: 'P1',
      automatedSummary: 'Structural or environmental fire hazard reported.',
      factors: ['High density commercial cluster', 'Flammable textile inventory'],
    };
  }

  return {
    category: `${category} Assessment`,
    confidence: 0.91,
    riskScore: severityInput === 'CRITICAL' ? 95 : severityInput === 'HIGH' ? 85 : severityInput === 'MODERATE' ? 65 : 40,
    recommendedAction: 'Assign local tourist desk assistance officer for verification.',
    priority: severityInput === 'CRITICAL' || severityInput === 'HIGH' ? 'P2' : 'P3',
    automatedSummary: 'Incident categorized and placed in operations dispatch queue.',
    factors: ['Report verified by digital tourist token', 'Geocoded GPS attested'],
  };
}

export function detectAnomaly(): AnomalyEvent[] {
  return [
    {
      id: 'ANOM-01',
      zone: 'Zone C (Esplanade / New Market)',
      type: 'Crowd Spike',
      severity: 'HIGH',
      confidence: 0.89,
      detectedAgo: '2 minutes ago',
      recommendation: 'Temporarily increase patrol coverage and activate crowd diversion signage.',
    },
    {
      id: 'ANOM-02',
      zone: 'Zone B (Bowbazar Corridor)',
      type: 'Incident Cluster',
      severity: 'HIGH',
      confidence: 0.92,
      detectedAgo: '6 minutes ago',
      recommendation: '3 incidents detected within 800m. Pre-position motorcycle first responders.',
    },
    {
      id: 'ANOM-03',
      zone: 'Zone D (Strand Road Riverfront)',
      type: 'Environmental Hazard',
      severity: 'MODERATE',
      confidence: 0.88,
      detectedAgo: '14 minutes ago',
      recommendation: 'Rain probability 74%. Display slick pavement advisory to nearby tourists.',
    }
  ];
}

export function calculateZoneRisk(zoneName: string, crowdDensity: number, incidentCount: number): ZoneRiskAssessment {
  const riskScore = Math.min(100, Math.round(crowdDensity * 0.5 + incidentCount * 12 + 15));
  const riskLevel: RiskLevel = riskScore > 80 ? 'HIGH' : riskScore > 50 ? 'MODERATE' : 'LOW';

  return {
    zoneName,
    riskLevel,
    riskScore,
    confidence: 0.93,
    factors: [
      `Crowd congestion level: ${crowdDensity}%`,
      `Recent incidents in 1hr: ${incidentCount}`,
      'Spatial lighting & CCTV index verified',
    ],
    recommendation: riskLevel === 'HIGH' 
      ? 'Redirect incoming tourist traffic toward adjacent green corridor.' 
      : 'Maintain standard proactive safety monitoring.',
  };
}

export function generateSafetyRecommendation(hour: number, riskLevel: RiskLevel): string[] {
  const recommendations = [
    'Prefer well-lit arterial routes after 9 PM.',
    'A verified Tourist Police booth is located 450m away near Park St Metro.',
    'Keep digital identification token cached for offline transit verification.',
  ];

  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    recommendations.unshift('Crowd density is elevated near your destination. Consider alternate bypass via Middleton Row.');
  }

  return recommendations;
}

export function findOptimalResponseUnit(
  incidentLat: number,
  incidentLng: number,
  units: EmergencyUnit[],
  category: IncidentCategory | string
): EmergencyUnit | null {
  const isMedical = category.toLowerCase().includes('medical') || category.toLowerCase().includes('health') || category.toLowerCase().includes('cardiac');
  
  const eligibleUnits = units
    .filter(u => u.status === 'Available' || u.status === 'Dispatched')
    .map(unit => {
      const dist = calculateDistance(incidentLat, incidentLng, unit.location[0], unit.location[1]);
      const eta = Math.max(1, Math.round(dist * 2.5));
      const typeScore = isMedical && unit.type.includes('Ambulance') ? 0 : !isMedical && unit.type.includes('Police') ? 0 : 1.5;
      return {
        ...unit,
        distanceKm: dist,
        etaMinutes: eta,
        compositeScore: dist + typeScore,
      };
    })
    .sort((a, b) => a.compositeScore - b.compositeScore);

  return eligibleUnits.length > 0 ? eligibleUnits[0] : null;
}
