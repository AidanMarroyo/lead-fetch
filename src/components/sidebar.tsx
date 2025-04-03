'use client';

import { Settings, ScanSearch, KanbanSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/dashboard/leads',
      label: 'Home',
      icon: ScanSearch,
    },
    {
      href: '/dashboard/crm',
      label: 'CRM Pipeline',
      icon: KanbanSquare,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className='hidden border-r bg-background md:block w-64 min-h-screen'>
      <div className='flex h-16 items-center px-4 border-b'>
        <h1 className='text-xl font-bold'>LeadFetch</h1>
      </div>
      <nav className='flex flex-col gap-1 p-4'>
        {routes.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted hover:text-primary',
              pathname === href && 'bg-muted text-primary'
            )}
          >
            <Icon className='h-4 w-4' />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
