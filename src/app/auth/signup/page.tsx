'use client';

import { useState } from 'react';
import { signup } from '@/actions/login';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import LoadingButton from '@/components/LoadingButton'; // ✅

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    await signup(formData);
    setLoading(false);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md p-6'>
        <form action={handleSubmit} className='space-y-6'>
          <CardHeader>
            <h1 className='text-2xl font-bold text-center text-foreground'>
              Create Account
            </h1>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input id='email' name='email' type='email' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-2'>
            <LoadingButton loading={loading} type='submit' className='w-full'>
              Create Account
            </LoadingButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
