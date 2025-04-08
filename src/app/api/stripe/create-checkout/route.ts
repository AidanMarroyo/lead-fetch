import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // ✅ Updated Stripe API version
});

const PRICE_IDS = {
  individual: 'price_1R9u8CQ2tJAF8eXe2Qqnmnjz',
  team: 'price_1RAChiQ2tJAF8eXeYepV4u2L',
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { plan }: { plan: 'individual' | 'team' } = await req.json();
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let stripeCustomerId: string;

  // Step 1: Ensure we have a customer ID in Supabase
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (existing?.stripe_customer_id) {
    stripeCustomerId = existing.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabaseUserId: user.id },
    });

    stripeCustomerId = customer.id;

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: stripeCustomerId,
      plan: 'free',
      status: 'inactive',
    });
  }

  // Step 2: Create the checkout session with existing customer
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripeCustomerId,
    line_items: [
      {
        price: PRICE_IDS[plan],
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        supabaseUserId: user.id,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing`,
  });

  return NextResponse.json({ url: session.url });
}
