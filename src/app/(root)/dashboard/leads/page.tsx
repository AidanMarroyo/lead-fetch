import { getCurrentUser } from '@/lib/auth';
import LeadScraperPage from './LeadScraperPage';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <LeadScraperPage userId={user.id} />;
}
