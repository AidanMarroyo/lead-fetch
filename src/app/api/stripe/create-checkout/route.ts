import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Stripe Price IDs for each plan
const PRICE_IDS = {
  pro: 'price_1R9u8CQ2tJAF8eXe2Qqnmnjz',
  team: 'price_1RAChiQ2tJAF8eXeYepV4u2L',
  unlimited: 'price_1RJNiGQ2tJAF8eXeMsfSdBBs',
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
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

      if (!subId || !custId) {
        console.error('❌ Missing customer or subscription in session');
        return new NextResponse('Missing customer or subscription', {
          status: 400,
        });
      }

      const subscription = await stripe.subscriptions.retrieve(subId);

      const priceId = subscription.items.data[0].price.id;

      // Determine plan from priceId
      const plan =
        priceId === PRICE_IDS.pro
          ? 'pro'
          : priceId === PRICE_IDS.unlimited
          ? 'unlimited'
          : priceId === PRICE_IDS.team
          ? 'team'
          : 'free'; // fallback

      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          status: subscription.status,
          plan,
        })
        .eq('stripe_customer_id', custId);

      if (error) {
        console.error('❌ Supabase update error:', error);
      } else {
        console.log('✅ Supabase subscription updated to', plan);
      }

      // ✅ TEAM PLAN: Create team + link user if needed
      if (plan === 'team') {
        const { data: user } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', custId)
          .single();

        if (user?.user_id) {
          const userId = user.user_id;

          const { data: existingTeam } = await supabase
            .from('team_members')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

          if (!existingTeam) {
            const { data: team, error: teamError } = await supabase
              .from('teams')
              .insert({
                owner_id: userId,
                name: 'My Team',
              })
              .select()
              .single();

            if (!teamError && team?.id) {
              await supabase.from('team_members').insert({
                user_id: userId,
                team_id: team.id,
                role: 'admin',
              });

              console.log('✅ Team created and user linked as admin');

                // ✅ Update all existing leads for this user with the new team_id
        const { error: updateLeadsError } = await supabase
        .from('leads')
        .update({ team_id: team.id })
        .eq('user_id', userId);

      if (updateLeadsError) {
        console.error('❌ Failed to assign team_id to existing leads:', updateLeadsError);
      }
              
            } else {
              console.error('❌ Error creating team:', teamError);
            }
          } else {
            console.log('ℹ️ User already in a team, skipping team creation');
          }
        }
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

      console.log('✅ Subscription marked as canceled');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return new NextResponse('Webhook handling error', { status: 500 });
  }
}