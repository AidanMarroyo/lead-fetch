type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

type LeadDetails = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  opening_hours?: { weekday_text: string[] };
  photos?: LeadPhoto[];
  types?: string[];
};

export function scoreLead(lead: LeadDetails & { website?: string }): number {
  let score = 0;

  // 1. Phone check
  if (!lead.phone) {
    score += 10;
  }

  // 2. Opening hours check
  if (!lead.opening_hours) {
    score += 10;
  }

  // 3. Photos check — make sure it's an array with at least one photo
  if (
    !Array.isArray(lead.photos) ||
    lead.photos.length === 0 ||
    lead.photos.some((photo) => !photo.photo_reference)
  ) {

    score += 10;
  }

  // 4. Types check — make sure it's a non-empty array of strings
  if (
    !Array.isArray(lead.types) ||
    lead.types.length === 0 ||
    lead.types.every((type) => typeof type !== 'string' || type.trim() === '')
  ) {
    score += 10;
  }

  // 5. User reviews check — include 0 reviews too
  if (
    lead.user_ratings_total === 0 ||
    (typeof lead.user_ratings_total === 'number' &&
      lead.user_ratings_total < 10)
  ) {
    score += 20;
  }

  // 6. Rating check — only penalize if rating is present and under 4.0
  if (typeof lead.rating === 'number' && lead.rating < 4.0) {
    score += 20;
  }

  // 7. Website check — optional but likely useful for your leads
  if (!lead.website) {
    score += 20;
  }

  return score;
}
