import { useDraggable } from '@dnd-kit/core';
import { Lead } from './types';
import { GripVertical } from 'lucide-react'; // Optional for drag handle icon

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
      className='bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:bg-muted relative'
      onClick={onClick}
    >
      {/* Optional drag handle in top-right */}
      <div
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()} // prevent opening modal when dragging
        className='absolute top-2 right-2 text-gray-400 cursor-grab'
      >
        <GripVertical size={16} />
      </div>

      <p className='font-medium'>{lead.name}</p>
      <p className='text-sm text-muted-foreground'>{lead.address}</p>
      <p className='text-xs text-right text-gray-500 mt-1'>
        Score: {lead.score}
      </p>
      <a
        href={`https://www.google.com/maps/place/?q=place_id:${lead.google_place_id}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs text-blue-500 hover:underline mt-2 block'
      >
        View on Google Maps
      </a>
    </div>
  );
}
