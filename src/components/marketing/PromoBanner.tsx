'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function PromoBanner() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className='w-full bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 text-sm font-medium relative z-50 overflow-hidden'>
      <div className='max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-center sm:text-left'>
        <p>
          Start strong —{' '}
          <span className='font-semibold'>
            Start <span className='font-bold'>FREE</span> and try pro features
            for 3 days
          </span>
          , no credit card required.
          <Link
            href='/auth/signup'
            className='ml-2 underline underline-offset-2 hover:text-white/90 transition'
          >
            Get started
          </Link>
        </p>

        <button
          className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/70'
          onClick={() => setHidden(true)}
          aria-label='Dismiss banner'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
