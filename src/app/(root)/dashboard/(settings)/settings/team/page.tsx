'use client';

import { InviteForm } from '@/components/team/InviteForm';
import { TeamManagement } from '@/components/team/TeamManagment';
import { useUserPlan } from '@/lib/userUserPlan';
import { Loader2 } from 'lucide-react';

export default function TeamSettingsPage() {
  const { plan, loading } = useUserPlan();

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto p-6 space-y-6 flex gap-2'>
        <p className='text-muted-foreground'>Loading team settings...</p>
        <Loader2 className='h-6 w-6 animate-spin mr-2' />
      </div>
    );
  }
  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Team Settings</h1>
      {plan === 'team' ? (
        <>
          <InviteForm />
          <TeamManagement />
        </>
      ) : (
        <div className='text-center p-4 border rounded-md bg-primary text-white'>
          <p className='text-lg font-semibold'>
            Upgrade to Team plan to manage your team
          </p>
        </div>
      )}
    </div>
  );
}
