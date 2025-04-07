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
    <div className='space-y-3 mt-6'>
      <h3 className='text-sm font-medium'>
        📌 Saved Searches (Auto Discovery)
      </h3>

      <ul className='space-y-2'>
        {searches.map((search) => (
          <li
            key={search.id}
            className='flex items-center justify-between border p-2 rounded-md bg-muted'
          >
            <div className='text-sm'>
              <div>
                <span className='font-medium'>{search.keyword}</span> in{' '}
                {search.location}
              </div>
              {search.last_ran && (
                <div className='text-xs text-muted-foreground'>
                  Last ran: {new Date(search.last_ran).toLocaleDateString()}
                </div>
              )}
            </div>

            <Button
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-600'
              onClick={() => confirmDelete(search.id)}
            >
              ✕
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            This search will be removed from weekly auto discovery.
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
