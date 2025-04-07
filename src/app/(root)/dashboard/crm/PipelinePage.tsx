'use client';

import { KanbanBoard } from '@/components/crm-board/kanban-board';
import { LeadFilters } from '@/components/leads/LeadFilter';
import { LeadFilter } from '@/lib/types';
import { useState } from 'react';

export default function PipelinePage() {
  const [filters, setFilters] = useState<LeadFilter>({
    status: undefined,
    location: '',
    minScore: 0,
    maxScore: 100,
  });

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-6'>Webbed CRM</h1>
      <LeadFilters onApply={setFilters} />
      <KanbanBoard filters={filters} />
    </div>
  );
}
