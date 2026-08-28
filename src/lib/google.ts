type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

export async function googlePlacesSearch(
  keyword: string,
  location: string
) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is missing.');
  }

  try {
    // -------------------------------------------------------
    // 1. Geocode requested city/location
    // -------------------------------------------------------
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${apiKey}`
    );

    const geoData = await geoRes.json();

    if (geoData.status !== 'OK' || !geoData.results?.length) {
      console.error('Google Geocoding API error:', geoData);

      throw new Error(
        `City "${location}" could not be geocoded. Status: ${geoData.status}`
      );
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // -------------------------------------------------------
    // 2. Search nearby businesses
    // -------------------------------------------------------
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=business&keyword=${encodeURIComponent(
        keyword
      )}&key=${apiKey}`
    );

    const placesData = await placesRes.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error('Google Nearby Search error:', placesData);

      throw new Error(
        `Google Nearby Search failed: ${placesData.status}`
      );
    }

    if (!placesData.results?.length) {
      return [];
    }

    // -------------------------------------------------------
    // 3. Get full details for each business
    // -------------------------------------------------------
    const businesses = await Promise.all(
      placesData.results.map(
        async (biz: {
          name: string;
          rating?: number;
          vicinity?: string;
          formatted_address?: string;
          place_id: string;
          user_ratings_total?: number;
          opening_hours?: {
            weekday_text?: string[];
          };
          photos?: LeadPhoto[];
          types?: string[];
          geometry?: {
            location?: {
              lat: number;
              lng: number;
            };
          };
        }) => {
          const fields = [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'photos',
            'types',
            'rating',
            'user_ratings_total',
            'reviews',
            'geometry',
          ].join(',');

          const detailsRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
              biz.place_id
            )}&fields=${fields}&key=${apiKey}`
          );

          const detailsData = await detailsRes.json();

          if (detailsData.status !== 'OK') {
            console.error(
              `Place Details error for ${biz.name} (${biz.place_id}):`,
              detailsData.status,
              detailsData.error_message
            );
          }

          const details = detailsData.result ?? {};

          return {
            name: details.name || biz.name,

            rating:
              details.rating ??
              biz.rating ??
              null,

            user_ratings_total:
              details.user_ratings_total ??
              biz.user_ratings_total ??
              null,

            opening_hours:
              details.opening_hours ??
              biz.opening_hours ??
              null,

            photos:
              details.photos ??
              biz.photos ??
              null,

            types:
              details.types ??
              biz.types ??
              null,

            place_id: biz.place_id,

            // ✅ IMPORTANT FIX
            address:
              details.formatted_address ||
              biz.formatted_address ||
              biz.vicinity ||
              '',

            phone:
              details.formatted_phone_number ||
              null,

            website:
              details.website ||
              null,

            lat:
              details.geometry?.location?.lat ??
              biz.geometry?.location?.lat ??
              null,

            lng:
              details.geometry?.location?.lng ??
              biz.geometry?.location?.lng ??
              null,

            reviews: Array.isArray(details.reviews)
              ? details.reviews
                  .map((review: { text?: string }) => review.text)
                  .filter(Boolean)
              : null,
          };
        }
      )
    );

    return businesses;
  } catch (error) {
    console.error('Error fetching businesses:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Unknown Google Places error'
    );
  }
}