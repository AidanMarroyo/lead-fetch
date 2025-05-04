'use server';

type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

export type Place = {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text: string[]; open_now?: boolean };
  photos?: LeadPhoto[];
  types?: string[];
  place_id?: string;
  address: string;
  formatted_phone_number?: string;
  website?: string;
  score?: number;
  phone?: string;
  reviews?: string[];
};

export async function analyzeGoogleProfile({
  place,
  reviews,
  googlePlaceId,
}: {
  place: Place;
  reviews?: { text: string }[];
  googlePlaceId?: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SCRAPER_API_URL}/google-profile-audit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place, reviews, googlePlaceId }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to generate Google Profile audit.');
    }

    const data = await res.json();
    return data.suggestions as string;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ analyzeGoogleProfile error:', error.message);
    } else {
      console.error('❌ analyzeGoogleProfile error:', error);
    }
    throw error;
  }
}
