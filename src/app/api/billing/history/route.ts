import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ history: [] });
  }

  try {
    const invoices = await stripe.invoices.list({
      customer: sub.stripe_customer_id,
      limit: 10,
    });

    console.log('Invoices:', invoices);

    const history = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount_paid: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: invoice.status,
      date: new Date(invoice.created * 1000).toLocaleDateString(),
      url: invoice.hosted_invoice_url,
    }));

    return NextResponse.json({ history });
  } catch (err) {
    console.error('❌ Failed to fetch billing history:', err);
    return NextResponse.json({ error: 'Failed to fetch billing history' }, { status: 500 });
  }
}
