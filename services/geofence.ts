import { GeofenceZone, RiskLevel } from '@/types';
import { calculateDistance } from '@/lib/utils';
import { mockGeofences } from './mockData';

export interface GeofenceEvaluation {
  currentZone: GeofenceZone | null;
  isInsideCaution: boolean;
  isInsideHighRisk: boolean;
  isInsideEmergency: boolean;
  nearestZone: GeofenceZone;
  distanceToNearestMeters: number;
  activeAdvisory: string | null;
  suggestedAction: string | null;
}

export function evaluateGeofencePosition(
  lat: number,
  lng: number,
  customGeofences: GeofenceZone[] = mockGeofences
): GeofenceEvaluation {
  let matchedZone: GeofenceZone | null = null;
  let nearestZone: GeofenceZone = customGeofences[0];
  let minDistanceMeters = Infinity;

  for (const zone of customGeofences) {
    const distKm = calculateDistance(lat, lng, zone.center[0], zone.center[1]);
    const distMeters = distKm * 1000;

    if (distMeters < minDistanceMeters) {
      minDistanceMeters = distMeters;
      nearestZone = zone;
    }

    if (distMeters <= zone.radius) {
      // If we match a higher risk zone, prioritize it
      if (!matchedZone || zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL') {
        matchedZone = zone;
      }
    }
  }

  const isCaution = matchedZone?.riskLevel === 'MODERATE';
  const isHighRisk = matchedZone?.riskLevel === 'HIGH' || matchedZone?.riskLevel === 'ELEVATED';
  const isEmergency = matchedZone?.riskLevel === 'CRITICAL';

  let activeAdvisory: string | null = null;
  let suggestedAction: string | null = null;

  if (matchedZone) {
    activeAdvisory = matchedZone.advisory;
    if (isEmergency) {
      suggestedAction = 'DANGER ZONE: Immediate rerouting advised. Responders alert active.';
    } else if (isHighRisk) {
      suggestedAction = 'Low pedestrian activity & recent incident reports. Use illuminated bypass.';
    } else if (isCaution) {
      suggestedAction = 'High crowd congestion zone. Keep belongings secure and watch footing.';
    }
  }

  return {
    currentZone: matchedZone,
    isInsideCaution: Boolean(isCaution),
    isInsideHighRisk: Boolean(isHighRisk),
    isInsideEmergency: Boolean(isEmergency),
    nearestZone,
    distanceToNearestMeters: Math.round(minDistanceMeters),
    activeAdvisory,
    suggestedAction,
  };
}
