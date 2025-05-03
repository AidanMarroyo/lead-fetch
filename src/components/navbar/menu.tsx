'use client';

import { Kanban, LayoutGrid, ScanSearch, Ticket } from 'lucide-react';
import { PiUsersThree } from 'react-icons/pi';
import { VscTools } from 'react-icons/vsc';
import { CiSettings } from 'react-icons/ci';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import Link from 'next/link';

export default function MenuDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          variant='ghost'
        >
          <span className='sr-only'>Apps</span>
          <LayoutGrid className='h-6 w-6' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='grid grid-cols-3 gap-4 p-4'>
        {menuItems.map(({ icon: Icon, label, href }) => (
          <DropdownMenuItem asChild key={label}>
            <Link href={href} className='block text-center'>
              <Icon className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                {label}
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const menuItems = [
  { icon: ScanSearch, label: 'Leads', href: '/dashboard/leads' },
  { icon: Kanban, label: 'Pipeline', href: '/dashboard/crm' },
  { icon: Ticket, label: 'Billing', href: '/dashboard/settings/billing' },
  { icon: PiUsersThree, label: 'Teams', href: '/dashboard/settings/team' },
  { icon: CiSettings, label: 'Settings', href: '/dashboard/settings' },
  { icon: VscTools, label: 'Tools', href: '/dashboard/tools' },
];
