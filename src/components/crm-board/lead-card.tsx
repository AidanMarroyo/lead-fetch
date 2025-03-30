import { useDraggable } from '@dnd-kit/core';
import { Lead } from './types';

export function LeadCard({ lead }: { lead: Lead }) {
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
      {...listeners}
      {...attributes}
      className='bg-white p-3 rounded-md border shadow-sm cursor-grab'
    >
      <p className='font-medium'>{lead.name}</p>
      <p className='text-sm text-muted-foreground'>{lead.address}</p>
      <p className='text-xs text-right text-gray-500 mt-1'>
        Score: {lead.score}
      </p>
    </div>
  );
}
