export async function geocodeLocation(
  location: string
): Promise<[number, number]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const encoded = encodeURIComponent(location);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data?.results?.[0]?.geometry?.location) {
    const { lat, lng } = data.results[0].geometry.location;
    return [lat, lng];
  }

  // Fallback to Toronto
  return [43.6532, -79.3832];
}
