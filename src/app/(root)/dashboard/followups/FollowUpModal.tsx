'use client';

import { createLeadNote } from '@/actions/createLeadNote';
import { getLeadNotes } from '@/actions/getLeadNotes';
import { logFollowUp } from '@/actions/logFollowup';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { startTransition, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function FollowUpModal({ leadId }: { leadId: string }) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<
    { id: string; message: string; author_name: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const leadNotes = await getLeadNotes(leadId);
        setNotes(leadNotes);
      } catch (err) {
        console.error('[Fetch Details Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [leadId]);

  const handleLogFollowUp = () => {
    startTransition(async () => {
      try {
        startTransition(async () => {
          try {
            await logFollowUp(leadId);
            toast.success('Follow-up logged.');
          } catch (err) {
            console.error(err);
            toast.error('Failed to log follow-up.');
          }
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to log follow-up.');
      }
    });
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    await createLeadNote(leadId, newNote);
    setNewNote('');
    const updatedNotes = await getLeadNotes(leadId);
    setNotes(updatedNotes);
    handleLogFollowUp();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Log Follow-Up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Follow-Up</DialogTitle>
          <DialogDescription>
            Add a note or update about this follow-up.
          </DialogDescription>
        </DialogHeader>
        {/* You can place form elements or any other content here */}
        <div className='mt-4'>
          <Textarea
            placeholder='Write your follow-up here...'
            className='w-full border rounded-md p-2 text-sm'
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </div>
        <div className='mt-4 max-h-64 overflow-y-auto space-y-3 pr-2'>
          {loading ? (
            <div className='size-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className='p-2 border rounded bg-muted text-sm'
              >
                <div className='text-xs text-muted-foreground mb-1'>
                  {note.author_name} •{' '}
                  {new Date(note.created_at).toLocaleString()}
                </div>
                <div>{note.message}</div>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
