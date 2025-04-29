'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from './columns'; // notice: renamed import
import { Lead } from './types';
import { LeadFilter } from '@/lib/types';
import { DataTableSkeleton } from '../data-table-skeleton';

export function LeadTable({
  filters,
  teamId,
}: {
  filters: LeadFilter;
  teamId: string | null;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
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

  return loading ? (
    <DataTableSkeleton columns={getColumns(teamId)} />
  ) : (
    <DataTable columns={getColumns(teamId)} data={leads} />
  );
}
