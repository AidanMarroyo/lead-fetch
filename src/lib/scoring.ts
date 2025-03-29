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

export function scoreLead(lead: LeadDetails): number {
  let score = 0;

  if (!lead.phone) score += 10;
  if (!lead.opening_hours) score += 10;
  if (!lead.photos?.length) score += 10;
  if (!lead.types?.length) score += 10;
  if (lead.user_ratings_total && lead.user_ratings_total < 10) score += 20;
  if (lead.rating && lead.rating < 4.0) score += 20;

  return score;
}
