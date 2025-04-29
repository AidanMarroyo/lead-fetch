'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/login'; // Assuming you have a validation schema for login
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/LoadingButton';
import Link from 'next/link';
import { LoginSchema, LoginValues } from '@/lib/validation';

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: LoginValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    await login(formData);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h1 className='text-xl font-semibold text-center'>
              Welcome back to Webbed Leads 👋
            </h1>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' {...register('email')} required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                {...register('password')}
                required
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <LoadingButton
              type='submit'
              loading={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </LoadingButton>

            <p className='text-sm text-muted-foreground text-center'>
              Need an account?{' '}
              <Link href='/signup' className='text-primary hover:underline'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
