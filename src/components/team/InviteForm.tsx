'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTeamAdmin } from '@/lib/team-admin';
import { Loader2 } from 'lucide-react';

export function InviteForm({ onInvited }: { onInvited?: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { admin } = useTeamAdmin();

  const handleInvite = async () => {
    setLoading(true);
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      toast.success('Team member invited successfully.');
      setEmail('');
      onInvited?.();
    } else {
      toast.error(result.error || 'Failed to invite user.');
    }

    setLoading(false);
  };

  if (!admin) return null;

  return (
    <div className='space-y-2 mb-6'>
      <label className='block font-medium text-sm'>Invite Team Member</label>
      <div className='flex gap-2'>
        <Input
          type='email'
          placeholder='user@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleInvite} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Inviting...
            </>
          ) : (
            'Invite'
          )}
        </Button>
      </div>
    </div>
  );
}
