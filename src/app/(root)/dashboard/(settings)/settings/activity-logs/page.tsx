'use client';

import { useEffect, useState } from 'react';

import { useUserPlan } from '@/lib/userUserPlan';
import { toast } from 'sonner';
import { ProTag } from '@/components/ui/ProTag';
import { Card } from '@/components/ui/card';
import { getActivityLogs } from '@/actions/getActivityLog';

type ActivityLog = {
  id: string;
  user_id: string;
  team_id?: string | null;
  action: string;
  message?: string | null;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
};

export default function ActivityPage() {
  const { plan } = useUserPlan();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const isPro = plan === 'individual' || plan === 'team';

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isPro) return;
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch {
        toast.error('Failed to fetch activity logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isPro]);

  if (!isPro) {
    return (
      <main className='max-w-3xl mx-auto mt-10'>
        <h1 className='text-2xl font-semibold mb-4'>Activity Log</h1>
        <p className='text-muted-foreground'>
          This feature is only available on the{' '}
          <span className='font-semibold'>Pro</span> and{' '}
          <span className='font-semibold'>Team</span> plans. <ProTag />
        </p>
      </main>
    );
  }

  return (
    <main className='max-w-3xl mx-auto mt-10'>
      <h1 className='text-2xl font-semibold mb-6'>Activity Log</h1>

      {loading ? (
        <p className='text-muted-foreground'>Loading activity…</p>
      ) : logs.length === 0 ? (
        <p className='text-muted-foreground'>No activity logged yet.</p>
      ) : (
        <ul className='space-y-4'>
          {logs.map((log) => {
            const fullName = `${log.profiles?.first_name} ${log.profiles?.last_name}`;
            return (
              <Card key={log.id} className='p-4'>
                <div className='text-sm'>
                  <span className='font-medium'>
                    {fullName.trim() || 'Someone'}
                  </span>{' '}
                  {log.action}
                  {log.message && (
                    <span className='text-muted-foreground'>
                      {' '}
                      — {log.message}
                    </span>
                  )}
                </div>
                <div className='text-xs text-muted-foreground mt-1'>
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </main>
  );
}
