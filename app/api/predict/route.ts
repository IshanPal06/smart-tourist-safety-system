import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

  try {
    const body = await req.json();

    // Validate essential coordinates
    if (body.latitude === undefined || body.longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: latitude and longitude are mandatory.' },
        { status: 400 }
      );
    }

    // Auto-fill time fields from current server clock if omitted
    const now = new Date();
    const currentHour = now.getHours();
    // JS getDay(): 0=Sun, 1=Mon... -> dataset spec: 0=Mon, 1=Tue ... 6=Sun
    const currentDow = (now.getDay() + 6) % 7;
    const isWeekend = currentDow >= 5 ? 1 : 0;

    const payload = {
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      hour: body.hour !== undefined ? Number(body.hour) : currentHour,
      day_of_week: body.day_of_week !== undefined ? Number(body.day_of_week) : currentDow,
      is_weekend: body.is_weekend !== undefined ? Number(body.is_weekend) : isWeekend,
      crowd_density: body.crowd_density !== undefined ? Number(body.crowd_density) : 50.0,
      crime_rate: body.crime_rate !== undefined ? Number(body.crime_rate) : 0.35,
      incident_count: body.incident_count !== undefined ? Number(body.incident_count) : 0,
      police_distance: body.police_distance !== undefined ? Number(body.police_distance) : 1.2,
      hospital_distance: body.hospital_distance !== undefined ? Number(body.hospital_distance) : 1.8,
      weather_condition: body.weather_condition !== undefined ? Number(body.weather_condition) : 0,
      temperature: body.temperature !== undefined ? Number(body.temperature) : 28.0,
      rainfall: body.rainfall !== undefined ? Number(body.rainfall) : 0.0,
      humidity: body.humidity !== undefined ? Number(body.humidity) : 65.0,
      tourist_speed: body.tourist_speed !== undefined ? Number(body.tourist_speed) : 2.5,
      dwell_time: body.dwell_time !== undefined ? Number(body.dwell_time) : 30,
      lighting_condition: body.lighting_condition !== undefined ? Number(body.lighting_condition) : (currentHour >= 18 || currentHour <= 5 ? 1 : 0),
      location_type: body.location_type !== undefined ? Number(body.location_type) : 0,
    };

    // Forward to Python ML Microservice
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      return NextResponse.json(
        {
          error: `ML Service returned error ${mlResponse.status}: ${errorText}`,
          service_available: true,
        },
        { status: mlResponse.status }
      );
    }

    const prediction = await mlResponse.json();
    return NextResponse.json({
      ...prediction,
      service_available: true,
      evaluated_at: new Date().toISOString(),
      source: 'ml_service',
      input_telemetry: payload,
    });
  } catch (err: any) {
    // Graceful offline degradation with transparent error message
    return NextResponse.json(
      {
        service_available: false,
        error: `ML prediction service is unavailable at ${mlServiceUrl}. Start the ML service using 'python ml/service.py'.`,
        detail: err.message || 'Connection refused',
      },
      { status: 503 }
    );
  }
}
