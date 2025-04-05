'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Member = {
  id: string;
  role: string;
  user_id: string;
  users: { email: string };
};

export function TeamManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch('/api/team/members');
      const data = await res.json();
      setMembers(data.members || []);
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
          {members.map((member) => (
            <div
              key={member.id}
              className='flex items-center justify-between border rounded-md px-4 py-2'
            >
              <div>
                <p className='font-medium'>{member.users.email}</p>
                <p className='text-sm text-muted-foreground'>{member.role}</p>
              </div>
              {member.role !== 'admin' && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleRemove(member.id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
