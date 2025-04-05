'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Lead } from './types';
import { LeadFilter } from '@/lib/types';

export function LeadTable({ filters }: { filters: LeadFilter }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ filters }),
      });
      const data = await res.json();
      setLeads(data);
    };

    fetchLeads();
  }, [filters]);

  return <DataTable columns={columns} data={leads} />;
}
