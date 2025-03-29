'use server';

import { googlePlacesSearch } from '@/lib/google'; // getPlaceDetails added
import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type Props = {
  keyword: string;
  location: string;
};

type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

type Place = {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text: string[] };
  photos?: LeadPhoto[];
  types?: string[];
  place_id: string;
  address: string;
  phone: string;
  website?: string;
};

export async function fetchLeadsFromGoogle({ keyword, location }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  try {
    const places = await googlePlacesSearch(keyword, location);

    if (!Array.isArray(places)) {
      console.error('Error fetching places.');
      return { success: false, message: 'Error fetching places.' };
    }

    // Only keep places without websites
    const leadsWithoutWebsites = places.filter(
      (place: Place) => !place.website
    );

    const placeIds = leadsWithoutWebsites.map((p) => p.place_id);

    // Prevent duplicates
    const { data: existingLeads, error: fetchError } = await supabase
      .from('leads')
      .select('google_place_id')
      .eq('user_id', user.id)
      .in('google_place_id', placeIds);

    if (fetchError) {
      console.error('Error fetching existing leads:', fetchError);
      return {
        success: false,
        message: `Error checking existing leads: ${fetchError.message}`,
      };
    }

    const existingIds = new Set(existingLeads.map((l) => l.google_place_id));

    const newLeads = leadsWithoutWebsites.filter(
      (lead: Place) => !existingIds.has(lead.place_id)
    );

    console.log('leads', newLeads);

    const inserts = newLeads.map((lead: Place) => ({
      user_id: user.id,
      name: lead.name,
      address: lead.address || '', // from biz.vicinity
      google_place_id: lead.place_id,
      phone: lead.phone || null,
      score: scoreLead(lead),
      category: keyword,
    }));

    if (inserts.length > 0) {
      const { error: insertError } = await supabase
        .from('leads')
        .insert(inserts);

      if (insertError) {
        console.error('Error inserting new leads:', insertError);
        return {
          success: false,
          message: `Error saving leads: ${insertError.message}`,
        };
      }
    }

    return { success: true, count: inserts.length };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: (error as Error).message };
  }
}
