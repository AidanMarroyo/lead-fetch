'use client';

import { useDraggable } from '@dnd-kit/core';
import { Lead } from './types';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

function getScoreBadge(score: number) {
  if (score >= 71)
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
  if (score >= 31)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
}

export function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card text-card-foreground p-4 rounded-xl border shadow-sm hover:bg-muted/60 cursor-pointer relative transition-all',
        'flex flex-col gap-2'
      )}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()}
        className='absolute top-2 right-2 text-muted-foreground cursor-grab hover:text-foreground'
      >
        <GripVertical size={16} />
      </div>

      <div className='text-sm font-semibold truncate'>{lead.name}</div>
      <div className='text-xs text-muted-foreground truncate'>
        {lead.address}
      </div>

      <div className='flex items-center justify-between mt-1'>
        <span
          className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
            getScoreBadge(lead.score)
          )}
        >
          Score: {lead.score}
        </span>

        <a
          href={`https://www.google.com/maps/place/?q=place_id:${lead.google_place_id}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-[10px] underline text-blue-500 hover:text-blue-600'
          onClick={(e) => e.stopPropagation()}
        >
          View on Maps
        </a>
      </div>
    </div>
  );
}
