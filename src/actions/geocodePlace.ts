export async function geocodeFromPlaceId(
  placeId: string
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('Missing Google Maps API key');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data?.result?.geometry?.location) {
    const { lat, lng } = data.result.geometry.location;
    return { lat, lng };
  }

  return null;
}
