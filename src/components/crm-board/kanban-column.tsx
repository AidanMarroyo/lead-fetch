import { useDroppable } from '@dnd-kit/core';
import { LeadCard } from './lead-card';
import { Lead } from './types';

export function KanbanColumn({
  status,
  items,
  onLeadClick,
}: {
  status: string;
  items: Lead[];
  onLeadClick: (lead: Lead) => void;
}) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className='bg-muted p-4 rounded-md shadow-md h-full'>
      <h2 className='text-lg font-semibold capitalize mb-3'>{status}</h2>
      <div className='space-y-2'>
        {items.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onLeadClick(lead)}
          />
        ))}
      </div>
    </div>
  );
}
