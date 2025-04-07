'use client';

import { saveSearch } from '@/actions/saveSearch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';

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
    <Button
      onClick={handleSave}
      variant='outline'
      className='gap-2'
      aria-label='Save this search for weekly discovery'
    >
      <SaveIcon className='w-4 h-4' />
      Save Search
    </Button>
  );
}
