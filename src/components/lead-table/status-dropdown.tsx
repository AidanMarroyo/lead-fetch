'use client';

import { Button } from '../ui/button';
import { updateLeadStatus } from '@/actions/updateLeadStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const statuses = ['new', 'contacted', 'in progress', 'closed'];

export function StatusDropdown({
  leadId,
  current,
}: {
  leadId: string;
  current: string;
}) {
  const handleChange = async (status: string) => {
    await updateLeadStatus(leadId, status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{current}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statuses.map((status) => (
          <DropdownMenuItem key={status} onClick={() => handleChange(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
