import { KanbanBoard } from '@/components/crm-board/kanban-board';
import { getUserSubscription } from '@/lib/subscriptions';
import { redirect } from 'next/navigation';

export default async function CRMPage() {
  const sub = await getUserSubscription();

  if (!sub || (sub.plan !== 'individual' && sub.plan !== 'team')) {
    redirect('/dashboard/leads'); // not allowed
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-6'>CRM Pipeline</h1>
      <KanbanBoard />
    </div>
  );
}
