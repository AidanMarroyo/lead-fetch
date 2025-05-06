'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/LoadingButton';
import { z } from 'zod';
import resetPassword from './update-password';
import { toast } from 'sonner';

export default function UpdatePasswordPage() {
  const updatePasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
      confirmPassword: z
        .string()
        .min(8, { message: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
    });
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    try {
      await resetPassword(formData);
      toast.success('Password successfully reset');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h1 className='text-xl font-semibold text-center'>
              Reset Your Password
            </h1>
          </CardHeader>

          <CardContent className='space-y-4'>
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
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <LoadingButton
              type='submit'
              loading={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </LoadingButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
