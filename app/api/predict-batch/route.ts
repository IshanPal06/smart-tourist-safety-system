import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

  try {
    const body = await req.json();
    if (!body.observations || !Array.isArray(body.observations)) {
      return NextResponse.json(
        { error: "Invalid payload: 'observations' must be an array." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const mlResponse = await fetch(`${mlServiceUrl}/predict-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ observations: body.observations }),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      return NextResponse.json(
        { error: `ML Service returned error ${mlResponse.status}: ${errorText}` },
        { status: mlResponse.status }
      );
    }

    const data = await mlResponse.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        service_available: false,
        error: `ML prediction service is unavailable at ${mlServiceUrl}.`,
        detail: err.message || 'Connection refused',
      },
      { status: 503 }
    );
  }
}
