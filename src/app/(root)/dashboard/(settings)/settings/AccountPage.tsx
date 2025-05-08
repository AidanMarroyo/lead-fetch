'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AccountSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('User not logged in.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (error) {
        toast.error('Failed to load profile');
      } else {
        setFirstName(data.first_name ?? '');
        setLastName(data.last_name ?? '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (firstName.trim() === '' || lastName.trim() === '') {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .eq('id', user?.id);
      if (error) {
        toast.error('Failed to update name.');
      }
      toast.success('Name updated successfully!');
      router.push('/dashboard/leads');
      setSaving(false);
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .eq('id', user?.id);

      if (error) {
        toast.error('Failed to update name.');
      }
      toast.success('Name updated successfully!');
      router.refresh(); // ✅ Force reload to update navbar data
    }

    setSaving(false);
  };

  return (
    <div className='max-w-xl mx-auto mt-10 space-y-6'>
      <h1 className='text-2xl font-semibold'>Account Settings</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='first_name'>First Name</Label>
          <Input
            id='first_name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='Enter your first name'
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor='last_name'>Last Name</Label>
          <Input
            id='last_name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Enter your last name'
            disabled={loading}
          />
        </div>
        <Button type='submit' disabled={saving || loading}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
