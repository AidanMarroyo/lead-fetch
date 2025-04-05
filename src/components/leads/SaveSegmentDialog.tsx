'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { LeadFilter } from '@/lib/types';

export function SaveSegmentDialog({
  open,
  onClose,
  filters,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  filters: LeadFilter;
  onSaved?: () => void;
}) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/segments/save', {
      method: 'POST',
      body: JSON.stringify({ name, filters }),
    });

    if (res.ok) {
      toast.success('Segment saved');
      onSaved?.();
      onClose();
    } else {
      toast.error('Failed to save');
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Filter Segment</DialogTitle>
        </DialogHeader>

        <Input
          placeholder='Segment name (e.g. High-Score in Toronto)'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          className='mt-4'
          onClick={handleSave}
          disabled={saving || !name}
        >
          {saving ? 'Saving...' : 'Save Segment'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
