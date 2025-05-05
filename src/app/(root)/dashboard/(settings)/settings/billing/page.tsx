'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type Subscription = {
  plan: string;
  status: string;
  ends_at: string | null;
};

interface BillingHistory {
  id: string;
  date: string;
  amount_paid: number;
  currency: string;
  status: string;
  url: string;
}

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [history, setHistory] = useState<BillingHistory[]>([]);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await fetch('/api/subscription');
        const data = await res.json();
        setSub(data);

        const histRes = await fetch('/api/billing/history');
        const histData = await histRes.json();
        setHistory(histData.history);
      } catch {
        toast.error('Failed to load subscription data.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSub();
  }, []);

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

  const handleUpgrade = async (plan: 'pro' | 'unlimited' | 'team') => {
    setLoading(true);
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });

    const { url } = await res.json();
    setLoading(false);

    if (url) {
      window.location.href = url;
    } else {
      toast.error('Checkout failed.');
    }
  };

  if (initialLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
        <span className='ml-2 text-sm text-muted-foreground'>
          Loading plan...
        </span>
      </div>
    );
  }

  const endDate = sub?.ends_at
    ? new Date(sub.ends_at).toLocaleDateString()
    : null;

  const today = new Date();

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
            <br />
            {sub?.ends_at &&
              (endDate && endDate < today.toLocaleDateString() ? (
                <>
                  <strong>Subscription ended on:</strong> {endDate}.
                </>
              ) : (
                <>
                  <strong>Subscription ending on:</strong> {endDate}.
                </>
              ))}
          </p>

          {sub?.plan !== 'free' && (
            <Button
              variant='destructive'
              onClick={handleCancel}
              disabled={loading}
              className='w-full mt-4'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Canceling...
                </>
              ) : (
                'Cancel Subscription'
              )}
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
              <li>Activity Logs</li>
              <li>CRM table + map view</li>
              <li>CSV export & filters</li>
            </ul>
            <Button
              onClick={
                sub?.plan === 'pro'
                  ? () => toast.success('Already on Pro')
                  : () => handleUpgrade('pro')
              }
              disabled={loading || sub?.plan === 'pro'}
              className='w-full mt-4'
            >
              {loading && sub?.plan !== 'pro' ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Redirecting...
                </>
              ) : sub?.plan === 'pro' ? (
                'Already on Pro'
              ) : (
                'Upgrade to Pro'
              )}
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
              <li>Google Profile insights</li>
              <li>AI Google Profile Audit</li>
              <li>AI Website Analyzer</li>
            </ul>
            <Button
              onClick={
                sub?.plan === 'unlimited'
                  ? () => toast.success('Already on unlimited')
                  : () => handleUpgrade('unlimited')
              }
              disabled={loading || sub?.plan === 'unlimited'}
              className='w-full mt-4'
            >
              {loading && sub?.plan !== 'unlimited' ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Redirecting...
                </>
              ) : sub?.plan === 'unlimited' ? (
                'Already on Unlimited'
              ) : (
                'Upgrade to Unlimited'
              )}
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
              <li>Everything in Unlimited & Pro</li>
              <li>Team access (up to 5 users)</li>
              <li>Shared pipelines & notes</li>
              <li>Lead Assignments</li>
            </ul>
            <Button
              onClick={
                sub?.plan === 'team'
                  ? () => toast.success('Already on team')
                  : () => handleUpgrade('team')
              }
              disabled={loading || sub?.plan === 'team'}
              className='w-full mt-4'
            >
              {loading && sub?.plan !== 'team' ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Redirecting...
                </>
              ) : sub?.plan === 'team' ? (
                'Already on Team'
              ) : (
                'Upgrade to Team'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className='mt-10'>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        {history.length > 0 ? (
          <CardContent>
            <ul className='space-y-3 text-sm'>
              {history.map((inv) => (
                <li key={inv.id} className='flex justify-between items-center'>
                  <div>
                    <p>
                      <strong>{inv.date}</strong> – {inv.amount_paid}{' '}
                      {inv.currency} ({inv.status})
                    </p>
                  </div>
                  <a
                    href={inv.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline text-sm'
                  >
                    View Invoice
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        ) : (
          <div>
            <p>No subscriptions paid for</p>
          </div>
        )}
      </Card>
    </div>
  );
}
