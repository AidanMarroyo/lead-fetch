'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(false);
  console.log('members', members);
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
                <p className='font-medium'>
                  {member.first_name} {member.last_name}
                </p>
                <p className='text-sm text-muted-foreground'>{member.email}</p>
              </div>
              {member.profiles?.owner_id === member.id && (
                <Button
                  variant='destructive'
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
