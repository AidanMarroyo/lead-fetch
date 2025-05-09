import { DashboardNavbar } from '@/components/navbar/navbar';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { SessionLayout } from './SessionLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data } = await supabase
    .from('profiles')
    .select('first_name, last_name, created_at')
    .eq('id', user?.id)
    .single();

  return (
    <SessionLayout>
      <DashboardNavbar
        userData={data || { first_name: '', last_name: '', created_at: '' }}
      />
      <div className='flex h-screen pt-16'>
        <div className='flex flex-col flex-1'>
          <main className='p-4 flex-1 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </SessionLayout>
  );
}
