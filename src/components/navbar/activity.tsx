'use client';

import { useEffect, useState } from 'react';
import { Activity, Eye, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useUserPlan } from '@/lib/userUserPlan';
import { toast } from 'sonner';
import { ProTag } from '../ui/ProTag';
import { getActivityLogs } from '@/actions/getActivityLog';

type ActivityLog = {
  id: string;
  user_id: string;
  team_id?: string | null;
  action: string;
  context?: string | null;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
};

export default function ActivityDropdown() {
  const { plan, loading: planLoading } = useUserPlan();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  const isProUser = plan === 'pro' || plan === 'unlimited' || plan === 'team';

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isProUser) return;
      setLogLoading(true);
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch (error) {
        toast.error('Failed to load activity');
        console.error('Failed to load activity', (error as Error).message);
      } finally {
        setLogLoading(false);
      }
    };

    if (!planLoading) fetchLogs();
  }, [plan, planLoading, isProUser]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          variant='ghost'
        >
          <span className='sr-only'>Activity Log</span>
          <Activity className='h-6 w-6' />
          {!planLoading && !isProUser && (
            <span className='absolute -top-1.5 -right-1.5'>
              <ProTag plan={'pro'} />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-80'>
        <div className='block rounded-t-lg bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          Activity Log
        </div>

        {planLoading ? (
          <div className='flex items-center justify-center px-4 py-4 text-muted-foreground'>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            <span>Loading plan...</span>
          </div>
        ) : isProUser ? (
          <>
            {logLoading ? (
              <p className='text-sm px-4 py-2 text-muted-foreground'>
                Loading activity…
              </p>
            ) : logs.length === 0 ? (
              <p className='text-sm px-4 py-2 text-muted-foreground'>
                No recent activity
              </p>
            ) : (
              logs.slice(0, 5).map((log) => {
                const fullName =
                  log.profiles?.first_name === null ||
                  log.profiles?.last_name === null
                    ? `${log.profiles?.email}`
                    : `${log.profiles?.first_name} ${log.profiles?.last_name}`;
                return (
                  <div
                    key={log.id}
                    className='px-4 py-2 text-sm border-b last:border-none'
                  >
                    <span className='font-medium'>{fullName}</span> {log.action}
                    {log.context && <span> — {log.context}</span>}
                    <div className='text-xs text-muted-foreground mt-1'>
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/settings/activity-logs'
                className='block text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600'
              >
                <div className='inline-flex items-center gap-x-2'>
                  <Eye className='h-5 w-5' />
                  <span>View all</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className='px-4 py-4 text-sm text-center text-muted-foreground'>
            <p>Upgrade to Pro to unlock activity history</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
