import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // ✅ Updated to match the expected type
});

const PRICE_IDS = {
  individual: 'price_1RAA9WL5eEpzBjLULIuuLdyP', // from Stripe
  team: 'price_1RAACpL5eEpzBjLU9yr3K4AR',
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { plan }: { plan: 'individual' | 'team' } = await req.json();
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  const customer =
    existing?.stripe_customer_id ||
    (
      await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUserId: user.id },
      })
    ).id;

  if (!existing?.stripe_customer_id) {
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      stripe_customer_id: customer,
      plan: 'free',
      status: 'inactive',
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRICE_IDS[plan],
        quantity: 1,
      },
    ],
    customer,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
