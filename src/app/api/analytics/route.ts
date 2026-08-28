import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/actions/getAnalytics';

export async function GET() {
  const data = await getAnalyticsData();
  return NextResponse.json(data);
}
