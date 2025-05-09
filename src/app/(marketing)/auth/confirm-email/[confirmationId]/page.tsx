import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  params: Promise<{ confirmationId: string }>;
};

export default async function ConfirmEmailPage(props: Props) {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const params = await props.params;
  const { confirmationId } = params;

  const { data: confirmation, error: confirmationError } = await supabase
    .from('confirmations')
    .select('profile_id')
    .eq('id', confirmationId)
    .single();

  if (confirmationError) {
    console.error('Error fetching confirmation:', confirmationError);
  }

  if (confirmation) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ confirmed: true })
      .eq('id', confirmation.profile_id);

    if (updateError) {
      console.error('Error updating confirmation:', updateError);
    }
    toast.success('Email confirmed! You can now log in.');

    if (user) {
      const { error: deleteError } = await supabase
        .from('confirmations')
        .delete()
        .eq('id', confirmationId);
      if (deleteError) {
        console.error('Error deleting confirmation:', deleteError);
      }
      redirect('/dashboard/settings');
    } else {
      const { error: deleteError } = await supabase
        .from('confirmations')
        .delete()
        .eq('id', confirmationId);
      if (deleteError) {
        console.error('Error deleting confirmation:', deleteError);
      }
      redirect('/auth/login');
    }
  }

  return <main></main>;
}
