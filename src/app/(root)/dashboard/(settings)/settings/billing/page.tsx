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

  const handleUpgrade = async (plan: 'pro' | 'unlimited' | 'team') => {
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

  const handleCancel = async () => {
    setLoading(true);
    const res = await fetch('/api/subscription/cancel', {
      method: 'POST',
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success('Subscription canceled.');
      window.location.reload();
    } else {
      toast.error(data.error || 'Cancellation failed.');
    }
  };

  return (
    <div className='max-w-5xl mx-auto mt-10 px-4'>
      <h1 className='text-2xl font-semibold mb-6'>Billing & Plans</h1>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Plan:</strong> {sub?.plan ?? 'free'}
            <br />
            <strong>Status:</strong> {sub?.status ?? 'inactive'}
          </p>

          {sub?.plan !== 'free' && (
            <Button
              variant='destructive'
              onClick={handleCancel}
              disabled={loading}
              className='w-full mt-4'
            >
              {loading ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* PRO PLAN */}
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col h-full justify-between text-sm'>
            <p className='text-muted-foreground pb-4'>$49/month USD</p>
            <ul className='list-disc list-inside space-y-1'>
              <li>35 leads/month</li>
              <li>Access USA + Canada</li>
              <li>Map View & CSV Export</li>
              <li>Website filters & audits</li>
              <li>AI-powered improvement suggestions</li>
            </ul>
            <Button
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
              className='w-full mt-4'
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>

        {/* UNLIMITED PLAN */}
        <Card>
          <CardHeader>
            <CardTitle>Unlimited</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col h-full justify-between text-sm'>
            <p className='text-muted-foreground pb-4'>$119/month USD</p>
            <ul className='list-disc list-inside space-y-1'>
              <li>Unlimited leads</li>
              <li>All Pro features included</li>
              <li>No monthly caps or limits</li>
            </ul>
            <Button
              onClick={() => handleUpgrade('unlimited')}
              disabled={loading}
              className='w-full mt-4'
            >
              Upgrade to Unlimited
            </Button>
          </CardContent>
        </Card>

        {/* TEAM PLAN */}
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col h-full justify-between text-sm'>
            <p className='text-muted-foreground pb-4'>$179/month USD</p>
            <ul className='list-disc list-inside space-y-1'>
              <li>Everything in Unlimited</li>
              <li>Team access & collaboration</li>
              <li>Up to 5 Users</li>
            </ul>
            <Button
              onClick={() => handleUpgrade('team')}
              disabled={loading}
              className='w-full mt-4'
            >
              Upgrade to Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
