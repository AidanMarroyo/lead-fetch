// app/dashboard/_components/DashboardNavbarWrapper.tsx
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import DashboardNavbar from '@/components/navbar/navbar';

export default async function DashboardNavbarWrapper() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user?.id)
    .single();

  return <DashboardNavbar userData={data ?? null} />;
}
