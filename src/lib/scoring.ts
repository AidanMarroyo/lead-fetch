type LeadDetails = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  opening_hours?: { weekday_text: string[] };
  photos?: any[];
  types?: string[];
};

export function scoreLead(lead: LeadDetails): number {
  let score = 0;

  if (!lead.formatted_phone_number) score += 10;
  if (!lead.opening_hours) score += 10;
  if (!lead.photos?.length) score += 10;
  if (!lead.types?.length) score += 10;
  if (lead.user_ratings_total && lead.user_ratings_total < 10) score += 20;
  if (lead.rating && lead.rating < 4.0) score += 20;

  return score;
}
