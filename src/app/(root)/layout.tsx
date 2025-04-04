'use client';

import { MobileSidebar } from '@/components/mobile-sidebar';
import { DashboardNavbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <div className='flex h-screen pt-16'>
        {/* <-- padding-top to offset navbar */}
        <Sidebar />
        <div className='flex flex-col flex-1'>
          <header className='md:hidden border-b p-2'>
            <MobileSidebar />
          </header>
          <main className='p-4 flex-1 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </>
  );
}
