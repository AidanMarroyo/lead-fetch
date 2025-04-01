'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Lead } from './types';
import { KanbanColumn } from './kanban-column';
import { LeadDetailModal } from './lead-detail-modal';

const STATUSES = ['new', 'contacted', 'in progress', 'closed'] as const;

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  const grouped = STATUSES.map((status) => ({
    status,
    items: leads.filter((lead) => lead.status === status),
  }));

  console.log('selectedLead', selectedLead);

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={async (event) => {
          const { active, over } = event;
          if (!over) return;

          const leadId = active.id as string;
          const newStatus = over.id as string;

          // Optimistic UI
          setLeads((prev) =>
            prev.map((lead) =>
              lead.id === leadId
                ? { ...lead, status: newStatus as (typeof STATUSES)[number] }
                : lead
            )
          );

          await fetch('/api/update-lead-status', {
            method: 'POST',
            body: JSON.stringify({ id: leadId, status: newStatus }),
          });
        }}
      >
        <div className='grid grid-cols-4 gap-4 mt-8'>
          <SortableContext
            items={STATUSES.map((status) => ({ id: status }))}
            strategy={verticalListSortingStrategy}
          >
            {grouped.map((group) => (
              <KanbanColumn
                key={group.status}
                status={group.status}
                items={group.items}
                onLeadClick={(lead) => setSelectedLead(lead)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* ✅ Modal rendered outside drag context */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updated) => {
            setLeads((prev) =>
              prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
            );
            setSelectedLead(null);
          }}
        />
      )}
    </>
  );
}
