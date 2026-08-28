'use client';

import { LeadFilter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

export function DownloadCSVButton({ filters }: { filters: LeadFilter }) {
  const handleDownload = async () => {
    const res = await fetch('/api/leads/export', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      variant='outline'
      className='gap-2'
      aria-label='Export leads to CSV'
    >
      <DownloadIcon className='w-4 h-4' />
      Export CSV
    </Button>
  );
}
