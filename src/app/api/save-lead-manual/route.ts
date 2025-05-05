import { geocodeFromPlaceId } from '@/actions/geocodePlace';
import { getCurrentUser } from '@/lib/auth';
import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lead = await req.json();

  // Prevent duplicate by Google Place ID
  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .eq('google_place_id', lead.google_place_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Lead already exists.' }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const calculatedScore = scoreLead({
    name: lead.name,
    phone: lead.phone,
    website: lead.website,
    rating: lead.rating,
    user_ratings_total: lead.user_ratings_total,
    opening_hours: lead.opening_hours,
    photos: lead.photos,
    types: lead.types,
  });

  const location = lead.address.split(',')[1].trim()
   const coords = await geocodeFromPlaceId(lead.google_place_id);

  const { error } = await supabase.from('leads').insert({
    address: lead.address,
    google_place_id: lead.google_place_id,
    phone: lead.phone,
    category: lead.types[0],
    location: location,
    name: lead.name,
    user_id: user.id,
    team_id: membership?.team_id || null,
    lat: coords?.lat,
    website: lead.website,
    lng: coords?.lng,
    score: calculatedScore,
    assigned_to_user_id: user.id,
    website_score: lead.website_score || 0,
    website_grade: lead.website_grade || null,
    auto_pitch: lead.auto_pitch || null,
    traffic_rank: lead.traffic_rank || null,
    ad_spend_estimate: lead.ad_spend_estimate || null,
    optimization_level: lead.optimization_level || null,
    tech_stack: lead.tech_stack || null,
    next_follow_up_date: new Date()
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
