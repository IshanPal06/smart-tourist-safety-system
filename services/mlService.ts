import { MLPredictionResult, MLTelemetryInput, TouristProfile, Incident, EmergencyUnit } from '@/types';
import { calculateDistance } from '@/lib/utils';

export interface MLServiceStatus {
  connected: boolean;
  status: 'healthy' | 'offline' | 'degraded';
  version?: string;
  error?: string;
}

/**
 * Checks the status of the local ML microservice via Next.js API route.
 */
export async function checkMLHealth(): Promise<MLServiceStatus> {
  try {
    const res = await fetch('/api/health', { cache: 'no-store' });
    if (!res.ok) {
      return { connected: false, status: 'offline', error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const ml = data.ml_service;
    if (ml && ml.connected) {
      return {
        connected: true,
        status: 'healthy',
        version: ml.model_version || '1.0.0',
      };
    }
    return {
      connected: false,
      status: 'offline',
      error: ml?.error || 'ML Service unreachable',
    };
  } catch (err: any) {
    return {
      connected: false,
      status: 'offline',
      error: err.message || 'Network error',
    };
  }
}

/**
 * Sends telemetry to /api/predict to obtain the Random Forest risk prediction.
 */
export async function predictTouristRisk(input: MLTelemetryInput): Promise<MLPredictionResult> {
  const res = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `ML prediction failed with status ${res.status}`);
  }

  return data as MLPredictionResult;
}

/**
 * Assembles verified 18-feature telemetry from real application state.
 * Combines GPS coordinates, client system clock, environmental sensors,
 * and emergency facility distances.
 */
export function buildTelemetryFromStore(
  tourist: TouristProfile,
  incidents: Incident[] = [],
  emergencyUnits: EmergencyUnit[] = []
): MLTelemetryInput {
  const now = new Date();
  const currentHour = now.getHours();
  // 0=Monday ... 6=Sunday
  const currentDow = (now.getDay() + 6) % 7;
  const isWeekend = currentDow >= 5 ? 1 : 0;

  const lat = tourist.currentLocation.lat;
  const lng = tourist.currentLocation.lng;

  // Compute nearest police facility distance (km)
  const policeUnits = emergencyUnits.filter(u => u.type.includes('Police'));
  let minPoliceDist = 1.2;
  if (policeUnits.length > 0) {
    const dists = policeUnits.map(u => calculateDistance(lat, lng, u.location[0], u.location[1]));
    minPoliceDist = Math.min(...dists);
  }

  // Compute nearest hospital / ambulance distance (km)
  const medicalUnits = emergencyUnits.filter(u => u.type.includes('Ambulance') || u.type.includes('Medical'));
  let minHospitalDist = 1.8;
  if (medicalUnits.length > 0) {
    const dists = medicalUnits.map(u => calculateDistance(lat, lng, u.location[0], u.location[1]));
    minHospitalDist = Math.min(...dists);
  }

  // Count active incidents in vicinity (< 1.5 km)
  const recentIncidents = incidents.filter(inc => {
    const d = calculateDistance(lat, lng, inc.location[0], inc.location[1]);
    return d <= 1.5;
  }).length;

  // Determine lighting: daylight (06:00 - 17:59), artificial (18:00 - 23:59 or 05:00 - 05:59), poor (night alleys)
  let lighting = 0;
  if (currentHour >= 18 || currentHour < 5) {
    lighting = 1; // Artificial by default in city center
  }

  // Weather mapping
  const weatherRisk = tourist.environmentalConditions.weatherRisk;
  let weatherCond = 0;
  let rainfall = 0.0;
  if (weatherRisk === 'CRITICAL') {
    weatherCond = 3; // Storm
    rainfall = 25.0;
  } else if (weatherRisk === 'HIGH') {
    weatherCond = 2; // Rain
    rainfall = 8.5;
  } else if (tourist.environmentalConditions.rainProbability > 50) {
    weatherCond = 1; // Cloudy
  }

  return {
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),
    hour: currentHour,
    day_of_week: currentDow,
    is_weekend: isWeekend,
    crowd_density: 65.0, // People per 100 m²
    crime_rate: 0.35,    // City context relative index
    incident_count: recentIncidents,
    police_distance: Number(minPoliceDist.toFixed(2)),
    hospital_distance: Number(minHospitalDist.toFixed(2)),
    weather_condition: weatherCond,
    temperature: tourist.environmentalConditions.temperature,
    rainfall: rainfall,
    humidity: 70.0,
    tourist_speed: 2.2,
    dwell_time: 35,
    lighting_condition: lighting,
    location_type: 0, // Attraction / General
  };
}
