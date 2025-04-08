import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

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

  console.log('✅ Stripe event received:', event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const subId = session.subscription as string;
      const custId = session.customer as string;

      if (!subId || !custId) {
        console.error('❌ Missing subscription or customer ID');
        return new NextResponse('Missing subscription or customer', {
          status: 400,
        });
      }

      const subscription = await stripe.subscriptions.retrieve(subId);
      const customer = await stripe.customers.retrieve(custId);

      if (
        typeof customer === 'object' &&
        'deleted' in customer &&
        customer.deleted === true
      ) {
        console.error('❌ Stripe customer was deleted');
        return new NextResponse('Customer deleted', { status: 400 });
      }

      const userId = (customer as Stripe.Customer).metadata?.supabaseUserId;

      if (!userId) {
        console.error('❌ Missing supabaseUserId in customer metadata');
        return new NextResponse('Missing user ID', { status: 400 });
      }

      const priceId = subscription.items.data[0].price.id;
      const plan =
        priceId === 'price_1R9u8CQ2tJAF8eXe2Qqnmnjz' ? 'individual' : 'team';

      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          status: subscription.status,
          plan,
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Supabase update error:', error);
      } else {
        console.log('✅ Subscription row updated for user:', userId);
      }

      // ✅ Optional: create team if they're on the team plan
      if (plan === 'team') {
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

            console.log('✅ Team created and user added as admin');
          } else {
            console.error('❌ Failed to create team:', teamError);
          }
        } else {
          console.log('ℹ️ User already in a team');
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;

      const customer = await stripe.customers.retrieve(sub.customer as string);

      // Proper narrowing: handle deleted customers
      if (
        typeof customer !== 'string' &&
        'deleted' in customer &&
        customer.deleted
      ) {
        console.error('❌ Stripe customer was deleted');
        return new NextResponse('Customer was deleted', { status: 400 });
      }

      const userId = (customer as Stripe.Customer).metadata?.supabaseUserId;

      if (userId) {
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
          })
          .eq('user_id', userId);

        console.log('✅ Subscription canceled and user downgraded');
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return new NextResponse('Webhook handler error', { status: 500 });
  }
}
