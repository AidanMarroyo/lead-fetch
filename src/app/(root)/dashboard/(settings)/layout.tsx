import { Metadata } from 'next';
import { SidebarNav } from './settings/sidebar-nav';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage billing, teams, and activity logs.',
};

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/dashboard/settings',
  },
  {
    title: 'Activity Logs',
    href: '/dashboard/settings/activity-logs',
  },
  {
    title: 'Billing',
    href: '/dashboard/settings/billing',
  },
  {
    title: 'Team',
    href: '/dashboard/settings/team',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');
  return (
    <div className='container sm:ml-20 py-10'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <aside className='lg:w-1/4'>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  );
}
