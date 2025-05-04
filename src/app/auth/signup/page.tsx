'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '@/actions/login';
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
import { SignUpSchema, SignUpValues } from '@/lib/validation';

export default function SignupPage() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignUpValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    await signup(formData);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h1 className='text-xl font-semibold text-center'>
              Create Your Webbed Leads Account 🕸️
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
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                {...register('confirmPassword')}
                required
              />
            </div>
            <p className='text-xs text-muted-foreground mt-3'>
              By signing up, you agree to our{' '}
              <a
                href='/terms'
                className='underline text-primary'
                target='_blank'
                rel='noopener noreferrer'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline text-primary'
                target='_blank'
                rel='noopener noreferrer'
              >
                Privacy Policy
              </a>
              . You consent to receive emails from WebbedLeads. You may
              unsubscribe from marketing emails at any time using the link
              provided in those messages.
            </p>
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <LoadingButton
              type='submit'
              loading={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </LoadingButton>

            <p className='text-sm text-muted-foreground text-center'>
              Already have an account?{' '}
              <Link href='/auth/login' className='text-primary hover:underline'>
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
