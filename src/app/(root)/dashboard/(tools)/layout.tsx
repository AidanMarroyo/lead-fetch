import { Metadata } from 'next';
import { SidebarNav } from '../(settings)/settings/sidebar-nav';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage billing, teams, and activity logs.',
};

const sidebarNavItems = [
  {
    title: 'Website Analysis',
    href: '/dashboard/tools',
  },
  {
    title: 'Add Lead',
    href: '/dashboard/tools/add-lead',
  },
];

interface ToolsLayoutProps {
  children: React.ReactNode;
}

export default async function ToolsLayout({ children }: ToolsLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

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
