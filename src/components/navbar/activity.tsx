import { Activity, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';

export default function ActivityDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          variant='ghost'
        >
          <span className='sr-only'>Notifications</span>
          <Activity className='h-6 w-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80'>
        <div className='block rounded-t-lg bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          Activity Log
        </div>
        {/* Notification items go here */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href='#'
            className='block text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600'
          >
            <div className='inline-flex items-center gap-x-2'>
              <Eye className='h-5 w-5' />
              <span>View all</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
