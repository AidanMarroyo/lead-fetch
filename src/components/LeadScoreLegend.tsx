'use client';

export function LeadScoreLegend() {
  return (
    <div className='p-4 border rounded-lg mb-6 bg-muted'>
      <h2 className='text-sm font-semibold mb-2'>🧠 How Lead Scoring Works</h2>
      <ul className='text-sm space-y-1'>
        <li>
          <strong>71–100 (Green)</strong>: High-potential leads. Missing key
          details like a website or reviews.
        </li>
        <li>
          <strong>31–70 (Orange)</strong>: Medium-quality leads. Some info is
          filled in, but not fully dialed in.
        </li>
        <li>
          <strong>0–30 (Red)</strong>: Low-opportunity. Fully optimized —
          already have a website, reviews, photos, etc.
        </li>
      </ul>

      <h3 className='text-sm font-semibold mt-4'>📉 Points Are Added If:</h3>
      <ul className='text-sm list-disc list-inside text-muted-foreground space-y-0.5 mt-1'>
        <li>No phone number (+10)</li>
        <li>No opening hours listed (+10)</li>
        <li>No photos or bad photo data (+10)</li>
        <li>No categories/types (+10)</li>
        <li>Less than 10 reviews (+20)</li>
        <li>Rating under 4.0 (+20)</li>
        <li>No website found (+20)</li>
      </ul>
    </div>
  );
}
