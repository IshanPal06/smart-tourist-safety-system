import { NextResponse } from 'next/server';

export async function GET() {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  let mlStatus: any = { connected: false, error: 'ML service unreachable' };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${mlServiceUrl}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      mlStatus = {
        connected: true,
        url: mlServiceUrl,
        ...data,
      };
    } else {
      mlStatus = {
        connected: false,
        status_code: res.status,
        url: mlServiceUrl,
      };
    }
  } catch (err: any) {
    mlStatus = {
      connected: false,
      url: mlServiceUrl,
      error: err.message || 'Connection refused',
    };
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    api: 'Next.js 14 App Router API',
    ml_service: mlStatus,
  });
}
