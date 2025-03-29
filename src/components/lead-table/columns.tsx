'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { Lead } from './types';
import { StatusDropdown } from './status-dropdown';

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
      const score = row.getValue('score') as number;
      return <Badge variant='outline'>{score}</Badge>;
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
