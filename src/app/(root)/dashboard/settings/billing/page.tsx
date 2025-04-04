'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type Subscription = {
  plan: string;
  status: string;
};

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSub = async () => {
      const res = await fetch('/api/subscription');
      const data = await res.json();
      setSub(data);
    };
    fetchSub();
  }, []);

  const handleUpgrade = async (plan: 'individual' | 'team') => {
    setLoading(true);
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    setLoading(false);
    if (url) window.location.href = url;
    else toast.error('Checkout failed.');
  };

  return (
    <div className='max-w-3xl mx-auto mt-10'>
      <h1 className='text-2xl font-semibold mb-6'>Billing</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Plan:</strong> {sub?.plan ?? 'free'}
            <br />
            <strong>Status:</strong> {sub?.status ?? 'inactive'}
          </p>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Individual Plan</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p>$29.99/month — Unlimited leads, CRM access</p>
            <Button
              onClick={() => handleUpgrade('individual')}
              disabled={loading}
            >
              Upgrade to Individual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Plan</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p>$79.99/month — Everything in Individual + team members</p>
            <Button onClick={() => handleUpgrade('team')} disabled={loading}>
              Upgrade to Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
