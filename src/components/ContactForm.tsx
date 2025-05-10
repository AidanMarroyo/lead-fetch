'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm({ userId }: { userId?: string }) {
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          toast.error(`Failed to fetch user data, ${error.message}`);
          return;
        }
        const fullName = `${data?.first_name} ${data?.last_name}`;
        setValue('name', fullName);
        setValue('email', data.email);
      };
      fetchUserData();
    }
  }, [userId, setValue, supabase]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      if (userId) {
        const res = await fetch('/api/support', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to send email');
      } else {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to send email');
      }

      toast.success('Message sent!');
      reset();
    } catch (error) {
      toast.error('There was an error sending your message.');
      console.error('Error sending message:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-xl mx-auto space-y-6 bg-background p-6 rounded-md border shadow-sm'
    >
      <h2 className='text-xl font-semibold'>📬 Contact Us</h2>

      <div>
        <label htmlFor='name' className='block text-sm font-medium mb-1'>
          Name
        </label>
        <Input id='name' {...register('name')} placeholder='Jane Doe' />
        {errors.name && (
          <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium mb-1'>
          Email
        </label>
        <Input
          id='email'
          {...register('email')}
          placeholder='you@example.com'
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='message' className='block text-sm font-medium mb-1'>
          Message
        </label>
        <Textarea
          id='message'
          {...register('message')}
          placeholder='Tell us a bit about what you need...'
          rows={5}
        />
        {errors.message && (
          <p className='text-red-500 text-sm mt-1'>{errors.message.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting} className='w-full'>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
