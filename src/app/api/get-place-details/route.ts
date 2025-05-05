import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('placeId');
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!placeId) {
    return NextResponse.json({ error: 'Missing placeId' }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,website,formatted_phone_number,rating,user_ratings_total,opening_hours,photos,types,place_id&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') {
    return NextResponse.json({ error: data.status }, { status: 500 });
  }

  const result = data.result;

  return NextResponse.json({
    name: result.name,
    address: result.formatted_address,
    phone: result.formatted_phone_number ?? null,
    website: result.website ?? null,
    google_place_id: result.place_id,
    rating: result.rating ?? null,
    user_ratings_total: result.user_ratings_total ?? null,
    opening_hours: result.opening_hours ?? null,
    photos: result.photos ?? [],
    types: result.types ?? [],
  });
}
