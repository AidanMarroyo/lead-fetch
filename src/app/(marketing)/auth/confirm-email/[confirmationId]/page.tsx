import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ confirmationId: string }>;
};

export const metadata: Metadata = {
  title: 'Confirm Your Email – WebbedLeads',
  description:
    "You're almost there. Confirm your email to activate your WebbedLeads account and start discovering high-quality leads.",
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
