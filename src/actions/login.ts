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

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: userData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  const { error: userInsertError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userData.user?.id,
      plan: 'free',
      status: 'inactive',
    });
  if (userInsertError) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard/leads');
}
