import { MobileSidebar } from '@/components/mobile-sidebar';
import { Sidebar } from '@/components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <header className='md:hidden border-b p-2'>
          <MobileSidebar />
        </header>
        <main className='p-4 flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
