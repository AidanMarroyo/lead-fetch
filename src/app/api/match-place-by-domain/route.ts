import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!domain) {
    return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
  }

  const plainDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');

  // Step 1: Search using the plain domain as the query
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    plainDomain
  )}&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.results || !Array.isArray(searchData.results)) {
    return NextResponse.json({ match: null });
  }

  // Step 2: Loop through results and fetch place details to check website
  for (const result of searchData.results) {
    const placeId = result.place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,website,formatted_phone_number,rating,user_ratings_total,opening_hours,photos,types&key=${apiKey}`;

    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (
      detailsData.status === 'OK' &&
      detailsData.result?.website
    ) {
      const placeWebsite = new URL(detailsData.result.website).hostname.replace(
        /^www\./,
        ''
      );

      if (placeWebsite === plainDomain) {
        return NextResponse.json({
          match: {
            name: detailsData.result.name,
            address: detailsData.result.formatted_address,
            phone: detailsData.result.formatted_phone_number || null,
            website: detailsData.result.website,
            place_id: placeId,
        
            // New fields for scoring
            rating: detailsData.result.rating,
            user_ratings_total: detailsData.result.user_ratings_total,
            opening_hours: detailsData.result.opening_hours,
            photos: detailsData.result.photos,
            types: detailsData.result.types,
          },
        });
        
      }
    }
  }

  return NextResponse.json({ match: null });
}
