'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface AssignUserDropdownProps {
  leadId: string;
  currentAssignedId?: string | null;
  teamId: string; // ✅ Pass team_id here!
}

interface TeamMember {
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null; // ✅ not an array
}

export function AssignUserDropdown({
  leadId,
  currentAssignedId,
  teamId,
}: AssignUserDropdownProps) {
  const [teamMembers, setTeamMembers] = useState<
    { id: string; name: string }[]
  >([]);
  const [selected, setSelected] = useState<string | undefined>(
    currentAssignedId || undefined
  );

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('team_members')
        .select('user_id, profiles!inner(first_name, last_name, email)') // ✅ Add email
        .eq('team_id', teamId);

      if (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
        return;
      }

      if (!data) return;
      console.log('Fetched team member data:', data);

      const cleaned = (data as unknown as TeamMember[]).map((member) => {
        const profile = member.profiles;
        let name = 'Unnamed User';

        if (profile) {
          const fullName = [profile.first_name, profile.last_name]
            .filter(Boolean)
            .join(' ')
            .trim();

          name = fullName || profile.email || 'Unnamed User';
        }

        return {
          id: member.user_id,
          name,
        };
      });

      setTeamMembers(cleaned);
    };

    if (teamId) {
      fetchTeamMembers();
    }
  }, [teamId]);

  const handleAssign = async (userId: string) => {
    setSelected(userId);

    const supabase = createClient();
    const { error } = await supabase
      .from('leads')
      .update({ assigned_to_user_id: userId }) // ✅ correct field
      .eq('id', leadId);

    if (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to assign lead.');
    } else {
      toast.success('Lead assigned successfully.');
    }
  };

  return (
    <Select value={selected} onValueChange={handleAssign}>
      <SelectTrigger>
        <SelectValue placeholder='Assign Lead' />
      </SelectTrigger>
      <SelectContent>
        {teamMembers.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
