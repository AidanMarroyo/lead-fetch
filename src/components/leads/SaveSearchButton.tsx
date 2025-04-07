'use client';

import { saveSearch } from '@/actions/saveSearch';
import { toast } from 'sonner';

export function SaveSearchButton({
  keyword,
  location,
}: {
  keyword: string;
  location: string;
}) {
  const handleSave = async () => {
    try {
      await saveSearch({ keyword, location });
      toast.success('Search saved for weekly discovery!');
    } catch {
      toast.error('Failed to save search.');
    }
  };

  return (
    <button
      onClick={handleSave}
      className='text-sm px-3 py-2 rounded border bg-muted hover:bg-muted/80'
    >
      💾 Save Search for Weekly Discovery
    </button>
  );
}
