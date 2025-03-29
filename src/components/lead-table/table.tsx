'use client';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import { Lead } from './types';
import { DataTable } from '../ui/data-table';

export function LeadTable() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  return <DataTable columns={columns} data={leads} />;
}
