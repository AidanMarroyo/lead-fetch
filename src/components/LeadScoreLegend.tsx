'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LeadScoreLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className='rounded-xl border border-border bg-muted/30 p-4 shadow-sm mb-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold tracking-tight'>
          🧠 How Lead Scoring Works
        </h2>
        <Button
          variant='ghost'
          onClick={() => setOpen((prev) => !prev)}
          className='text-xs'
        >
          {open ? 'Hide' : 'Show'}
        </Button>
      </div>

      {open && (
        <div className='mt-4 text-sm space-y-4'>
          <div className='space-y-1.5'>
            <p className='font-medium text-muted-foreground'>Score Breakdown</p>
            <ul className='space-y-1'>
              <li>
                <Badge className='bg-green-100 text-green-700'>71–100</Badge> =
                Strong lead (missing website, reviews, etc.)
              </li>
              <li>
                <Badge className='bg-yellow-100 text-yellow-700'>31–70</Badge> =
                Moderate quality (some info present)
              </li>
              <li>
                <Badge className='bg-red-100 text-red-700'>0–30</Badge> = Lower
                potential (fully optimized)
              </li>
            </ul>
          </div>

          <div className='space-y-1.5'>
            <p className='font-medium text-muted-foreground'>
              📉 Points Are Added If:
            </p>
            <ul className='list-disc list-inside text-muted-foreground space-y-1'>
              <li>
                No phone number{' '}
                <span className='text-xs text-muted'>(+10)</span>
              </li>
              <li>
                No opening hours listed{' '}
                <span className='text-xs text-muted'>(+10)</span>
              </li>
              <li>
                No photos or poor photo data{' '}
                <span className='text-xs text-muted'>(+10)</span>
              </li>
              <li>
                No business categories{' '}
                <span className='text-xs text-muted'>(+10)</span>
              </li>
              <li>
                Fewer than 10 reviews{' '}
                <span className='text-xs text-muted'>(+20)</span>
              </li>
              <li>
                Google Rating under 4.0{' '}
                <span className='text-xs text-muted'>(+20)</span>
              </li>
              <li>
                No website present{' '}
                <span className='text-xs text-muted'>(+20)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
