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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const plan = subscription?.plan ?? 'free';

  let monthlyLeadCount = 0;
  let monthlyLimit = 0;

  if (plan === 'free' || plan === 'trial') monthlyLimit = 10;
  if (plan === 'pro') monthlyLimit = 40;

  if (monthlyLimit > 0) {
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
      return NextResponse.json(
        { success: false, message: 'Failed to check lead limits.' },
        { status: 500 }
      );
    }

    monthlyLeadCount = count ?? 0;

    if (monthlyLeadCount >= monthlyLimit) {
      return NextResponse.json(
        {
          success: false,
          message: `You’ve reached your ${monthlyLimit}-lead monthly limit on the ${plan} plan.`,
        },
        { status: 403 }
      );
    }
  }

  try {
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('google_place_id', lead.google_place_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Lead already exists.' }, { status: 400 });
    }

    if (plan === 'free' || plan === 'trial') {
      const remaining = 10 - monthlyLeadCount;

      if (remaining <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'You’ve reached your 10-lead limit for the month on the free plan.',
          },
          { status: 403 }
        );
      }
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

    const location = lead.address.split(',')[1].trim();
    const coords = await geocodeFromPlaceId(lead.google_place_id);
    const today = new Date();

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
      next_follow_up_date: today,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
