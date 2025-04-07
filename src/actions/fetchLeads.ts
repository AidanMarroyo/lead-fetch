'use server';

import { googlePlacesSearch } from '@/lib/google';
import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { geocodeFromPlaceId } from './geocodePlace';

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

export type Place = {
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
  city?: string;
  lat?: number;
  lng?: number;
};

export async function fetchLeadsFromGoogle({ keyword, location }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 🔐 STEP 1: Fetch user subscription plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const plan = subscription?.plan ?? 'free';

  // 🔒 STEP 2: Enforce 3-lead monthly limit for free users
  let monthlyLeadCount = 0;

  if (plan === 'free') {
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', firstOfMonth.toISOString());

    if (countError) {
      console.error('Error checking monthly limit:', countError);
      return { success: false, message: 'Failed to check lead limits.' };
    }

    monthlyLeadCount = count ?? 0;

    if (monthlyLeadCount >= 3) {
      return {
        success: false,
        message:
          'You’ve reached your 3-lead limit for the month on the free plan.',
      };
    }
  }

  // STEP 3: Fetch leads from Google
  try {
    const places = await googlePlacesSearch(keyword, location);

    if (!Array.isArray(places)) {
      console.error('Error fetching places.');
      return { success: false, message: 'Error fetching places.' };
    }

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

    // ✅ Enforce free-tier limit
    let allowedNewLeads = newLeads;

    if (plan === 'free') {
      const remaining = 3 - monthlyLeadCount;

      if (remaining <= 0) {
        return {
          success: false,
          message:
            'You’ve reached your 3-lead limit for the month on the free plan.',
        };
      }

      allowedNewLeads = newLeads.slice(0, remaining);
    }

    // ✅ Get team_id if user is part of a team
    const { data: membership } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const teamId = membership?.team_id || null;

    const inserts = await Promise.all(
      allowedNewLeads.map(async (lead: Place) => {
        const coords = await geocodeFromPlaceId(lead.place_id);
        return {
          user_id: user.id,
          team_id: teamId, // ✅ shared across team if present
          name: lead.name,
          address: lead.address || '',
          google_place_id: lead.place_id,
          phone: lead.phone || null,
          score: scoreLead(lead),
          category: keyword,
          location: location,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
        };
      })
    );

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

    return {
      success: true,
      count: inserts.length,
      message:
        inserts.length === 0
          ? 'No new leads found.'
          : `Saved ${inserts.length} new lead${inserts.length > 1 ? 's' : ''}.`,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: (error as Error).message };
  }
}
