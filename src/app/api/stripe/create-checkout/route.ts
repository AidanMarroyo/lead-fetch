// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const PRICE_IDS = {
  pro: 'price_1R9u8CQ2tJAF8eXe2Qqnmnjz',
  unlimited: 'price_1REIHjL5eEpzBjLUroAdAwSb',
  team: 'price_1RAChiQ2tJAF8eXeYepV4u2L',
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan }: { plan: keyof typeof PRICE_IDS } = await req.json();

  if (!PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    customer: profile.stripe_customer_id,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}