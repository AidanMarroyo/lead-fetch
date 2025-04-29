import { getCurrentUser } from '@/lib/auth';
import PipelinePage from './PipelinePage';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');
  return (
    <main>
      <PipelinePage userId={user.id} />
    </main>
  );
}
