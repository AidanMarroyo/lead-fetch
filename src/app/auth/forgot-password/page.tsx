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
import forgotPassword from './forget-password';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  });
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const formData = new FormData();
    formData.append('email', data.email);
    await forgotPassword(formData);
    toast.success('Reset password request sent to email');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h1 className='text-xl font-semibold text-center'>
              Forgot Password
            </h1>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' {...register('email')} required />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <LoadingButton
              type='submit'
              loading={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
            </LoadingButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
