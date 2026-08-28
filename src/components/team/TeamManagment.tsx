'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useTeamAdmin } from '@/lib/team-admin';

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  profiles?: {
    owner_id: string;
  };
  email: string;
};

export function TeamManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false); // for removing a member
  const [initialLoading, setInitialLoading] = useState(true); // for fetching members
  const { admin } = useTeamAdmin();

  useEffect(() => {
    const fetchMembers = async () => {
      setInitialLoading(true);
      try {
        const res = await fetch('/api/team/members');
        const data = await res.json();
        setMembers(data.members || []);
      } catch {
        toast.error('Failed to load team members');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleRemove = async (memberId: string) => {
    const confirmed = confirm('Remove this team member?');
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch('/api/team/remove', {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });

    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success('Member removed');
    } else {
      toast.error('Failed to remove member');
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {initialLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between border rounded-md px-4 py-2'
              >
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-4 w-40' />
                  <Skeleton className='h-3 w-64' />
                </div>
                <Skeleton className='h-8 w-20 rounded-md' />
              </div>
            ))
          ) : members.length === 0 ? (
            <p className='text-muted-foreground'>No team members yet.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className='flex items-center justify-between border rounded-md px-4 py-2'
              >
                <div>
                  <p className='font-medium'>
                    {member.first_name} {member.last_name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {member.email}
                  </p>
                </div>
                {admin && (
                  <Button
                    variant='destructive'
                    onClick={() => handleRemove(member.id)}
                    disabled={loading}
                  >
                    {loading ? 'Removing…' : 'Remove'}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
