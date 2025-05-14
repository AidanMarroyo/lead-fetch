'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserProfile {
  confirmed?: boolean;
  email?: string;
}

export function SessionLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<UserProfile>({
    confirmed: false,
    email: '',
  });
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: confirmed, error: confirmedError } = await supabase
        .from('profiles')
        .select('confirmed, email')
        .eq('id', user?.id)
        .single();
      if (confirmedError) {
        console.error('Error fetching confirmed status:', confirmedError);
      }

      setSession(user);
      setConfirmed(confirmed || { confirmed: false, email: '' });
      setLoading(false);
    };

    fetchSession();
  }, [supabase]);

  // Redirect if no session after loading
  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth/login');
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='size-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
      </div>
    );
  }

 // const logout = async () => {
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     console.error('Error signing out:', error);
//   } else {
//     router.push('/auth/login');
//   }
// };

// const onConfirmation = async () => {
//   try {
//     const res = await fetch('/api/email/confirmation', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email: confirmed.email }),
//     });

//     if (!res.ok) throw new Error('Failed to send email');

//     toast.success(`Confirmaton email sent to ${confirmed.email}`);
//   } catch (error) {
//     toast.error('There was an error sending your message.');
//     console.error('Error sending message:', error);
//   }
// };

  // if (!confirmed.confirmed) {
//   return (
//     <main>
//       <section className='pb-20 pt-39 lg:pb-25 lg:pt-44'>
//         <div className='mx-auto w-full max-w-[598px] px-4 text-center sm:px-8 lg:px-0'>
//           <Image
//             src='/confirm.png'
//             alt='404'
//             className='mx-auto mb-12.5 w-1/2 sm:w-full'
//             width={598}
//             height={559}
//           />
//           <h1 className='mb-5 text-heading-6 font-bold text-dark sm:text-heading-4 lg:text-heading-3'>
//             {confirmed?.email} is not confirmed yet.
//           </h1>

//           <div className='flex gap-6 justify-center'>
//             <Button
//               variant='outline'
//               className='hover:cursor-pointer'
//               onClick={onConfirmation}
//             >
//               Resend confirmation email
//             </Button>
//             <Button className='hover:cursor-pointer' onClick={logout}>
//               Return to login
//             </Button>
//           </div>

//           {/*  <p className='mb-7.5'>
//             The page you are looking for is not available or has been moved. Try
//             a different page or go to homepage with the button below.
//           </p> */}
//         </div>
//       </section>
//     </main>
//   );
// }

  return <>{children}</>;
}
