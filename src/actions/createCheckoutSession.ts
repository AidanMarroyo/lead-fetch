'use server';

import Stripe from 'stripe';
import { getCurrentUserAndOrg } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

type PlanType = 'solo' | 'team';

const PLAN_PRICE_MAP: Record<PlanType, string> = {
  solo: process.env.STRIPE_SOLO_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
};

export async function createCheckoutSession(plan: PlanType) {
  const { user, org } = await getCurrentUserAndOrg();
  if (!user || !org) return { url: null };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PLAN_PRICE_MAP[plan], quantity: 1 }],
    customer_email: user.email,
    metadata: { org_id: org.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancel`,
  });

  return { url: session.url };
}
