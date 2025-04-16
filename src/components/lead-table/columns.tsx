import { ColumnDef } from '@tanstack/react-table';
import { Lead } from './types';
import { StatusDropdown } from './status-dropdown';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'name',
    header: 'Business Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const score = row.original.score;
      return (
        <span
          className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            score >= 71
              ? 'bg-green-100 text-green-700'
              : score >= 31
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          )}
        >
          {score}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const lead = row.original;
      return <StatusDropdown leadId={lead.id} current={lead.status} />;
    },
  },
];
