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
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Invalid webhook signature:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    // === Handle checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      const plan =
        priceId === PRICE_IDS.pro
          ? 'pro'
          : priceId === PRICE_IDS.unlimited
          ? 'unlimited'
          : priceId === PRICE_IDS.team
          ? 'team'
          : 'free';

      // Update subscription record
      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          status: subscription.status,
          plan,
        })
        .eq('stripe_customer_id', customerId);

      if (error) console.error('❌ Failed to update subscription:', error);
      else console.log('✅ Updated subscription to', plan);

      // If team plan, create team + assign leads
      if (plan === 'team') {
        const { data: subUser } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        const userId = subUser?.user_id;
        if (!userId) return NextResponse.json({ received: true });

        // Check if already in team
        const { data: existing } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!existing) {
          const { data: team, error: teamErr } = await supabase
            .from('teams')
            .insert({ owner_id: userId, name: 'My Team' })
            .select()
            .single();

          if (team?.id && !teamErr) {
            await supabase.from('team_members').insert({
              user_id: userId,
              team_id: team.id,
              role: 'admin',
            });

            await supabase
              .from('leads')
              .update({ team_id: team.id })
              .eq('user_id', userId);

            console.log('✅ Team created and user linked');
          } else {
            console.error('❌ Failed to create team:', teamErr);
          }
        }
      }
    }

    // === Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'canceled',
        })
        .eq('stripe_subscription_id', subscription.id);

      console.log('✅ Subscription canceled and downgraded to free');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook processing failed:', err);
    return new NextResponse('Webhook handler error', { status: 500 });
  }
}
