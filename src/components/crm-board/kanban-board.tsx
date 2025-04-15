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
import { LeadFilter } from '@/lib/types';

const STATUSES = ['new', 'contacted', 'in progress', 'closed'] as const;

export function KanbanBoard({ filters }: { filters: LeadFilter }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ filters }),
      });
      const data = await res.json();
      setLeads(data);
      setLoading(false);
    };
    fetchLeads();
  }, [filters]);

  const grouped = STATUSES.map((status) => ({
    status,
    items: leads.filter((lead) => lead.status === status),
  }));

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
        <div className='mt-8 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4'>
          <SortableContext
            items={STATUSES.map((status) => ({ id: status }))}
            strategy={verticalListSortingStrategy}
          >
            {loading
              ? STATUSES.map((status) => (
                  <SkeletonColumn key={status} status={status} />
                ))
              : grouped.map((group) => (
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
            setSelectedLead(updated);
          }}
        />
      )}
    </>
  );
}
function SkeletonColumn({ status }: { status: string }) {
  return (
    <div className='bg-gray-100 dark:bg-muted rounded-lg p-4 shadow-md w-full'>
      <h2 className='text-lg font-semibold mb-4 capitalize '>
        {status.replace('-', ' ')}
      </h2>
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='h-20 bg-gray-200 dark:bg-card rounded-md animate-pulse'
          ></div>
        ))}
      </div>
    </div>
  );
}
