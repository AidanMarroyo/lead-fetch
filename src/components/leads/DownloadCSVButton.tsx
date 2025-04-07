'use client';

import { LeadFilter } from '@/lib/types';

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
    <button
      onClick={handleDownload}
      className='text-sm px-3 py-2 rounded border bg-white hover:bg-muted'
    >
      📤 Export to CSV
    </button>
  );
}
