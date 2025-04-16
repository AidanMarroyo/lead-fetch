'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { updateLeadStatus } from '@/actions/updateLeadStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const statuses = [
  'new',
  'contacted',
  'in progress',
  'closed',
  'archived',
  'not interested',
];

export function StatusDropdown({
  leadId,
  current,
}: {
  leadId: string;
  current: string;
}) {
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    try {
      setSaving(true);
      setStatus(newStatus); // ✅ optimistic update
      await updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      setStatus(current); // ❌ rollback if error
    } finally {
      setSaving(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' disabled={saving}>
          {saving ? 'Saving...' : status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statuses.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleChange(s)}
            disabled={s === status}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
