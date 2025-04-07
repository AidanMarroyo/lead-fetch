'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { BadgeCheck, Users, Briefcase } from 'lucide-react';

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
    <div className='max-w-4xl mx-auto mt-10'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        💳 WebbedLead Billing
      </h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BadgeCheck className='w-5 h-5 text-green-600' />
            Your Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm leading-relaxed'>
            <p>
              <strong>Plan:</strong>{' '}
              <span className='capitalize'>{sub?.plan ?? 'free'}</span>
            </p>
            <p>
              <strong>Status:</strong> {sub?.status ?? 'inactive'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-300 shadow-sm hover:shadow-md transition'>
          <CardHeader className='flex flex-row items-center gap-3'>
            <Briefcase className='w-6 h-6 text-blue-600' />
            <div>
              <CardTitle>Individual Plan</CardTitle>
              <CardDescription className='text-muted-foreground'>
                Perfect for solo web agencies.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm'>
              <span className='text-lg font-bold'>$69.99 USD/month</span> — Full
              CRM access, unlimited leads, map view, CSV export, and weekly
              discovery.
            </p>
            <Button
              className='w-full'
              onClick={() => handleUpgrade('individual')}
              disabled={loading}
            >
              Upgrade to Individual
            </Button>
          </CardContent>
        </Card>

        <Card className='border border-gray-300 shadow-sm hover:shadow-md transition'>
          <CardHeader className='flex flex-row items-center gap-3'>
            <Users className='w-6 h-6 text-green-600' />
            <div>
              <CardTitle>Team Plan</CardTitle>
              <CardDescription className='text-muted-foreground'>
                For agencies with collaborators.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm'>
              <span className='text-lg font-bold'>$199.99 USD/month</span> — All
              Individual features plus team invites, lead assignment, and
              activity tracking.
            </p>
            <Button
              className='w-full'
              onClick={() => handleUpgrade('team')}
              disabled={loading}
            >
              Upgrade to Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
