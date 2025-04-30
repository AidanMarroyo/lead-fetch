import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const PRICE_IDS = {
  pro: 'price_1R9u8CQ2tJAF8eXe2Qqnmnjz',
  unlimited: 'price_1RJNiGQ2tJAF8eXeMsfSdBBs',
  team: 'price_1RAChiQ2tJAF8eXeYepV4u2L',
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Stripe webhook signature error:', err);
    return new NextResponse('Webhook error', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subId = session.subscription as string;
      const custId = session.customer as string;

      const subscription = await stripe.subscriptions.retrieve(subId);
      const priceId = subscription.items.data[0].price.id;

      const plan =
        priceId === PRICE_IDS.pro
          ? 'pro'
          : priceId === PRICE_IDS.unlimited
          ? 'unlimited'
          : priceId === PRICE_IDS.team
          ? 'team'
          : 'free';

          console.log('custId', custId);
      console.log('subId', subId);
      console.log('session', session);


      await supabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          status: subscription.status,
          plan,
        })
        .eq('stripe_customer_id', custId);

      if (plan === 'team') {
        const { data: subUser } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', custId)
          .single();

        const userId = subUser?.user_id;
        if (!userId) return NextResponse.json({ received: true });

        const { data: existing } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
          
          if (existing) {
            return NextResponse.json(
              { error: 'User already in team' },
              { status: 400 }
            );
          }

        if (!existing) {
          const { data: team } = await supabase
            .from('teams')
            .insert({ owner_id: userId, name: 'My Team' })
            .select()
            .single();

          if (team?.id) {
            await supabase.from('team_members').insert({
              user_id: userId,
              team_id: team.id,
              role: 'admin',
            });

            await supabase
              .from('leads')
              .update({ team_id: team.id })
              .eq('user_id', userId);

            await supabase.from('profiles').update({ team_id: team.id }).eq('id', userId);
          }
          
         
        }
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
    
      if (sub.cancel_at_period_end) {
        // Cancellation scheduled
        const cancelAt = sub.cancel_at
          ? new Date(sub.cancel_at * 1000).toISOString()
          : null;
    
        await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            ends_at: cancelAt,
          })
          .eq('stripe_subscription_id', sub.id);
      }
    }
    
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
    
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          plan: 'free',
        })
        .eq('stripe_subscription_id', sub.id);
    }
    

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    return new NextResponse('Webhook handling error', { status: 500 });
  }
}