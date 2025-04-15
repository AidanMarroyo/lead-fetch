'use server';

import { googlePlacesSearch } from '@/lib/google';
import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { geocodeFromPlaceId } from './geocodePlace';
import { logActivity } from './logActivity';

type Props = {
  keyword: string;
  location: string;
  user_id?: string; // ✅ override for cron
  withWebsites: boolean; // ✅ override for cron
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

export async function fetchLeadsFromGoogle({
  keyword,
  location,
  user_id,
  withWebsites,
}: Props) {
  const supabase = await createClient();

  // ✅ Step 1: Get current user or use override
  let userId = user_id;

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/auth/login');
    }

    userId = user.id;
  }

  // 🔐 STEP 1: Fetch user subscription plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();

  const plan = subscription?.plan ?? 'free';

 // 🔒 Enforce monthly limits based on plan
let monthlyLeadCount = 0;
let monthlyLimit = 0;

if (plan === 'free') monthlyLimit = 3;
if (plan === 'pro') monthlyLimit = 35;
// Pro & Team = unlimited (0 means no cap)

if (monthlyLimit > 0) {
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', firstOfMonth.toISOString());

  if (countError) {
    console.error('Error checking monthly limit:', countError);
    return { success: false, message: 'Failed to check lead limits.' };
  }

  monthlyLeadCount = count ?? 0;

  if (monthlyLeadCount >= monthlyLimit) {
    return {
      success: false,
      message: `You’ve reached your ${monthlyLimit}-lead monthly limit on the ${plan} plan.`,
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

    // Filter based on `withWebsites` flag
    const filteredPlaces = places.filter((place: Place) =>
      withWebsites ? !!place.website : !place.website
    );

    const placeIds = filteredPlaces.map((p) => p.place_id);

    // Prevent duplicates
    const { data: existingLeads, error: fetchError } = await supabase
      .from('leads')
      .select('google_place_id')
      .eq('user_id', userId)
      .in('google_place_id', placeIds);

    if (fetchError) {
      console.error('Error fetching existing leads:', fetchError);
      return {
        success: false,
        message: `Error checking existing leads: ${fetchError.message}`,
      };
    }

    const existingIds = new Set(existingLeads.map((l) => l.google_place_id));
    const newLeads = filteredPlaces.filter(
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
      .eq('user_id', userId)
      .maybeSingle();

    const teamId = membership?.team_id || null;

    const inserts = await Promise.all(
      allowedNewLeads.map(async (lead: Place) => {
        const coords = await geocodeFromPlaceId(lead.place_id);
        return {
          user_id: userId,
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
          website: lead.website || null,
        };
      })
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    if (inserts.length > 0) {
      const { error: insertError } = await supabase
        .from('leads')
        .insert(inserts);

      await logActivity({
        userId: userId,
        teamId: teamId,
        action: 'leads_added',
        message: `${profile?.first_name} ${profile?.last_name} added ${inserts.length} leads in ${location} for the keyword "${keyword}".`,
      });

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
