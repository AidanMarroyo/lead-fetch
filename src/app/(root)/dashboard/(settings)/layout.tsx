import { Metadata } from 'next';
import { SidebarNav } from './settings/sidebar-nav';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage billing, teams, and activity logs.',
};

const sidebarNavItems = [
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

export default function SettingsLayout({ children }: SettingsLayoutProps) {
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
