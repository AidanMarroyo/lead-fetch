import { getCurrentUser } from '@/lib/auth';
import PipelinePage from './PipelinePage';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <main>
      <PipelinePage userId={user.id} />
    </main>
  );
}
