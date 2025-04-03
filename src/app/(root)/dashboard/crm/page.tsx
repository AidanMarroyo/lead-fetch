import { KanbanBoard } from '@/components/crm-board/kanban-board';

export default function CRMPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-6'>CRM Pipeline</h1>
      <KanbanBoard />
    </div>
  );
}
