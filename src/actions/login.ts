'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard/leads');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) redirect('/error');

  const userId = signUpData.user?.id;
  if (!userId) redirect('/error');

  // Check if this user was invited to a team
  const { data: invite } = await supabase
    .from('team_invites')
    .select('team_id')
    .eq('email', email)
    .single();

  if (invite?.team_id) {
    // Join the team they were invited to
    await supabase.from('team_members').insert({
      user_id: userId,
      team_id: invite.team_id,
      role: 'member',
    });

    // Delete the invite (optional)
    await supabase.from('team_invites').delete().eq('email', email);

    // Also add a subscription record
    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'team',
      status: 'active',
    });
  } else {
    // Default to free plan
    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'free',
      status: 'inactive',
    });
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard/leads');
}
