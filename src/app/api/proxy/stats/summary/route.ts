import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_API_BASE_URL ??
  'https://neurodecode-backend-90710068442.asia-southeast1.run.app';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 600;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok && attempt < MAX_RETRIES - 1) {
    await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
    return fetchWithRetry(url, attempt + 1);
  }
  return res;
}

export async function GET() {
  try {
    const res = await fetchWithRetry(`${BACKEND_URL}/stats/summary`);

    if (!res.ok) {
      return NextResponse.json({ error: `Backend returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[proxy/stats/summary] fetch error after retries:', err);
    return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
  }
}
