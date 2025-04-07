import { Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import { useUserPlan } from '@/lib/userUserPlan';
import { getActivityLog } from '@/utils/activity-logger';

export default function ActivityDropdown() {
  const { plan } = useUserPlan();
  const isProUser = plan === 'individual' || plan === 'team';
  const activities = isProUser ? getActivityLog() : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white relative ${
            !isProUser ? 'pro-feature' : ''
          }`}
          variant='ghost'
        >
          <span className='sr-only'>Activity Log</span>
          <Activity className='h-6 w-6' />
          {!isProUser && <span className='pro-tag'>Pro</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80'>
        <div className='block rounded-t-lg bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          Activity Log
        </div>
        {isProUser ? (
          activities.length > 0 ? (
            activities.map((log, index) => (
              <DropdownMenuItem key={index} className='text-sm'>
                {log.timestamp}: {log.activity}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem className='text-sm text-center'>
              No recent activity.
            </DropdownMenuItem>
          )
        ) : (
          <DropdownMenuItem className='text-sm text-center'>
            Upgrade to Pro to access the activity log.
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {isProUser && (
          <DropdownMenuItem asChild>
            <Link
              href='/activity-log'
              className='block text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600'
            >
              <div className='inline-flex items-center gap-x-2'>
                <Eye className='h-5 w-5' />
                <span>View all</span>
              </div>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
