'use client';

import { KanbanBoard } from '@/components/crm-board/kanban-board';
import { LeadFilters } from '@/components/leads/LeadFilter';
import { LeadScoreLegend } from '@/components/LeadScoreLegend';
import { LeadFilter } from '@/lib/types';
import { useUserPlan } from '@/lib/userUserPlan';
import { useCallback, useState } from 'react';
import ScraperForm from '../leads/ScraperForm';

export default function PipelinePage({ userId }: { userId: string }) {
  const { plan } = useUserPlan();
  const [scrapeKey, setScrapeKey] = useState(0);
  const [filters, setFilters] = useState<LeadFilter>({
    name: '',
    status: undefined,
    location: '',
    minScore: 0,
    maxScore: 100,

    assignedTo: undefined,
  });

  const handleApplyFilters = useCallback((filters: LeadFilter) => {
    setFilters(filters);
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-6'>Webbed CRM</h1>
      <ScraperForm
        plan={plan}
        onScrapeComplete={() => setScrapeKey((prev) => prev + 1)}
      />

      <LeadFilters
        onApply={handleApplyFilters}
        scrapeKey={scrapeKey}
        userId={userId}
      />
      <LeadScoreLegend />
      <KanbanBoard filters={filters} key={`${scrapeKey}-${filters.dueOnly}`} />
    </div>
  );
}
