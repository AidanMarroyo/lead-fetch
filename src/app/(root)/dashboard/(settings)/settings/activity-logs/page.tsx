'use client';
import { useEffect, useState } from 'react';
import { useUserPlan } from '@/lib/userUserPlan';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { getActivityLogs } from '@/actions/getActivityLog';
import { Loader2 } from 'lucide-react';

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
    email?: string;
  };
};

export default function ActivityPage() {
  const { plan, loading: planLoading, setLoading } = useUserPlan();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const isPro =
    plan === 'pro' ||
    plan === 'unlimited' ||
    plan === 'team' ||
    plan === 'trial';

  useEffect(() => {
    if (!isPro || planLoading) return;

    const fetchLogs = async () => {
      setLogsLoading(true);
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch {
        toast.error('Failed to fetch activity logs.');
      } finally {
        setLogsLoading(false);
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isPro, planLoading]);

  if (plan === 'free') {
    return (
      <main className='max-w-3xl mx-auto mt-10'>
        <h1 className='text-2xl font-semibold mb-4'>Activity Log</h1>
        <p className='text-muted-foreground'>Upgrade to unlock activity logs</p>
      </main>
    );
  }

  if (planLoading || logsLoading) {
    return (
      <main className='max-w-3xl mx-auto mt-10'>
        <h1 className='text-2xl font-semibold mb-4'>Activity Log</h1>
        <div className='flex items-center gap-2'>
          <p className='text-muted-foreground'>Loading activity…</p>
          <Loader2 className='h-6 w-6 animate-spin mr-2' />
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-3xl mx-auto mt-10'>
      <h1 className='text-2xl font-semibold mb-6'>Activity Log</h1>

      {logs.length === 0 ? (
        <p className='text-muted-foreground'>No activity logged yet.</p>
      ) : (
        <ul className='space-y-4'>
          {logs.map((log) => {
            const fullName =
              !log.profiles?.first_name || !log.profiles?.last_name
                ? `${log.profiles?.email}`
                : `${log.profiles?.first_name} ${log.profiles?.last_name}`;
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
