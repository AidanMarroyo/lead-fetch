'use client';

import dynamic from 'next/dynamic';

// Dynamically load the map to avoid SSR issues
const LeadsMap = dynamic(() => import('./LeadsMapClient'), {
  ssr: false,
  loading: () => (
    <div className='px-4 py-4 text-muted-foreground text-sm'>
      Loading map...
    </div>
  ),
});

export default LeadsMap;
