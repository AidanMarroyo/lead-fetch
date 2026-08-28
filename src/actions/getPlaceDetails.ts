// app/actions/getPlaceDetails.ts
'use server';

import { getCurrentUser } from "@/lib/auth";

export async function getPlaceDetails(placeId: string) {
  const user = await getCurrentUser();
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const fields = [
    'name',
    'formatted_phone_number',
    'website',
    'opening_hours',
    'photos',
    'types',
    'rating',
    'user_ratings_total',
    'reviews',
  ].join(',');

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
  );

  const data = await res.json();
  

  if (data.status === 'OK') {
    return data.result;
  }

  console.error(
    'Failed to fetch Google Place Details:',
    data.status,
    data.error_message
  );
  return null;
}
