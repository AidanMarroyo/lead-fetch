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

  const { data: loginData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Error logging in:', error.message);
  }

  const {data: createdAtData, error: createdAtError} = await supabase
    .from('profiles').select('created_at').eq('id', loginData.user?.id).single();

    if (createdAtError) {
      console.error('Error fetching created_at:', createdAtError.message);
    }

    if (!createdAtData) {
      console.error('No created_at data found.');
    }

    const now = new Date();
    const createdAt = new Date(createdAtData?.created_at);
    const msSinceSignup = now.getTime() - createdAt.getTime();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    
    if (msSinceSignup >= threeDaysInMs) {
      const { error: subscriptionUpdateError } = await supabase
        .from('subscriptions')
        .update({ plan: 'free' })
        .eq('user_id', loginData.user?.id);
    
      if (subscriptionUpdateError) {
        console.error('Failed to downgrade plan:', subscriptionUpdateError);
      }
    }
    
  revalidatePath('/dashboard/leads', 'layout');
  redirect('/dashboard/leads');
}

// export async function signup(formData: FormData) {
//   const supabase = await createClient();
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     console.error('Error signing up:', error.message);
//   }
//   revalidatePath('/', 'layout');
//   redirect('/dashboard/leads');
// }

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) console.error('Error signing up:', error.message);

  const userId = signUpData.user?.id;
  if (!userId) console.error('No user ID found after sign up.');

  const { data: invite } = await supabase
    .from('team_invites')
    .select('team_id')
    .eq('email', data.email)
    .single();

  if (invite?.team_id) {
    await supabase.from('team_members').insert({
      user_id: userId,
      team_id: invite.team_id,
      role: 'member',
    });

    await supabase.from('team_invites').delete().eq('email', data.email);

    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'team',
      status: 'active',
    });

    await supabase.from('profiles').update({ team_id: invite.team_id }).eq('id', userId);
  } else {
    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'trial',
      status: 'inactive',
    });
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard/settings');
}
