type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

export async function googlePlacesSearch(keyword: string, location: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // const supabase = await createClient();

  try {
    // Step 1: Get city coordinates
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results.length)
      throw new Error(`City "${location}" not found.`);

    const { lat, lng } = geoData.results[0].geometry.location;

    // Step 2: Get list of businesses
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=business&keyword=${keyword}&key=${apiKey}`
    );
    const placesData = await placesRes.json();

    if (!placesData.results.length) return [];

    // Step 3: Fetch additional details for each business
    const businesses = await Promise.all(
      placesData.results.map(
        async (biz: {
          name: string;
          rating: number;
          vicinity: string;
          place_id: string;
          user_ratings_total: number;
          opening_hours: { weekday_text: string[] };
          photos: LeadPhoto[];
          types: string[];
        }) => {
          const detailsRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.place_id}&fields=name,formatted_phone_number,website,opening_hours,photos,types,rating,user_ratings_total,reviews&key=${apiKey}`
          );

          const detailsData = await detailsRes.json();

          return {
            name: detailsData.result?.name || biz.name,
            rating: detailsData.result?.rating ?? biz.rating ?? null,
            user_ratings_total:
              detailsData.result?.user_ratings_total ??
              biz.user_ratings_total ??
              null,
            opening_hours: detailsData.result?.opening_hours ?? null,
            photos: detailsData.result?.photos ?? null,
            types: detailsData.result?.types ?? null,
            place_id: biz.place_id,
            address: biz.vicinity || null,
            phone: detailsData.result?.formatted_phone_number || null,
            website: detailsData.result?.website || null,
            reviews: detailsData.result?.reviews
              ? detailsData.result.reviews.map((review: { text: string }) => review.text)
              : null
          };
        }
      )
    );

    return businesses;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw new Error((error as Error).message);
  }
}

export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,url&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') {
    console.error(`Place Details Error for ${placeId}:`, data.status);
    return null;
  }

  return data.result;
}
