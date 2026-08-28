'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AssignedUserNameProps {
  userId?: string | null;
}

export function AssignedUserName({ userId }: AssignedUserNameProps) {
  const [name, setName] = useState<string>('Unassigned');

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (!userId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error fetching assigned user:', error);
        return;
      }

      if (data.first_name && data.last_name) {
        setName(`${data.first_name} ${data.last_name}`);
      } else {
        setName(data.email || 'Unnamed User');
      }
    };

    fetchAssignedUser();
  }, [userId]);

  return <span className='text-sm text-muted-foreground'>{name}</span>;
}
