'use client';

import { DashboardNavbar } from '@/components/navbar/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <div className='flex h-screen pt-16'>
        <div className='flex flex-col flex-1'>
          <main className='p-4 flex-1 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </>
  );
}
