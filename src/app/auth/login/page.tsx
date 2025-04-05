'use client';

import { login, signup } from '@/actions/login';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <form>
          <CardHeader>
            <h1 className='text-xl font-semibold text-center'>
              Welcome back 👋
            </h1>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' name='email' type='email' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' name='password' type='password' required />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-2'>
            <Button formAction={login} className='w-full'>
              Log in
            </Button>
            <Button formAction={signup} variant='outline' className='w-full'>
              Sign up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
