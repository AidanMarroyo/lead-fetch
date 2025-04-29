import { getCurrentUser } from '@/lib/auth';
import LeadScraperPage from './LeadScraperPage';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');

  return <LeadScraperPage userId={user.id} />;
}
