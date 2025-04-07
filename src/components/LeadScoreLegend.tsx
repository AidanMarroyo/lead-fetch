'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LeadScoreLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className='p-4 border rounded-lg mb-6 bg-muted'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>🧠 How Lead Scoring Works</h2>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setOpen((prev) => !prev)}
          className='text-xs'
        >
          {open ? 'Hide' : 'Show'}
        </Button>
      </div>

      {open && (
        <div className='mt-3 text-sm space-y-3'>
          <ul>
            <li>
              <strong>71–100 (Green)</strong>: High-potential leads. Missing
              website, reviews, or other signals.
            </li>
            <li>
              <strong>31–70 (Orange)</strong>: Medium-quality leads. Some info
              present, but not dialed in.
            </li>
            <li>
              <strong>0–30 (Red)</strong>: Low-opportunity. Fully optimized
              businesses.
            </li>
          </ul>

          <h3 className='text-sm font-semibold'>📉 Points Are Added If:</h3>
          <ul className='list-disc list-inside text-muted-foreground space-y-1'>
            <li>No phone number (+10)</li>
            <li>No opening hours listed (+10)</li>
            <li>No photos or poor photo data (+10)</li>
            <li>No business categories (+10)</li>
            <li>Fewer than 10 reviews (+20)</li>
            <li>Google Rating under 4.0 (+20)</li>
            <li>No website present (+20)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
