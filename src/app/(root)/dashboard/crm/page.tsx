import { protectCRMAccess } from '@/lib/protect';
import PipelinePage from './PipelinePage';

export default async function CRMPage() {
  await protectCRMAccess(); // 🔒 Enforce plan and handle redirect

  return (
    <main>
      <PipelinePage />
    </main>
  );
}
