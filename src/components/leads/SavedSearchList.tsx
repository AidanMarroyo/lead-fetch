'use client';

import { useEffect, useState } from 'react';
import { getSavedSearches } from '@/actions/getSavedSearches';
import { deleteSavedSearch } from '@/actions/deleteSavedSearch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SavedSearch = {
  id: string;
  keyword: string;
  location: string;
  created_at: string;
  last_ran?: string | null;
};

export function SavedSearchList() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const data = await getSavedSearches();
        setSearches(data);
      } catch {
        toast.error('Failed to load saved searches');
      } finally {
        setLoading(false);
      }
    };

    fetchSearches();
  }, []);

  const confirmDelete = (id: string) => setDeleteId(id);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSavedSearch(deleteId);
      setSearches((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success('Search deleted');
    } catch {
      toast.error('Failed to delete search');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading)
    return (
      <p className='text-sm text-muted-foreground'>Loading saved searches...</p>
    );

  if (searches.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>No saved searches yet.</p>
    );
  }

  return (
    <div className='space-y-4 mt-6'>
      <h3 className='text-sm font-semibold tracking-tight'>
        📌 Saved Searches (Auto Discovery)
      </h3>

      <ul className='space-y-2'>
        {searches.map((search) => (
          <li
            key={search.id}
            className='flex items-center justify-between gap-4 border bg-muted px-4 py-3 rounded-lg hover:shadow-sm transition'
          >
            <div className='text-sm space-y-0.5'>
              <div>
                <span className='font-medium'>{search.keyword}</span> in{' '}
                {search.location}
              </div>
              {search.last_ran && (
                <div className='text-xs text-muted-foreground'>
                  Last ran: {new Date(search.last_ran).toLocaleString()}
                </div>
              )}
            </div>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-red-500 hover:text-red-600'
                    onClick={() => confirmDelete(search.id)}
                  >
                    <Trash2Icon className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            This search will no longer run automatically.
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
