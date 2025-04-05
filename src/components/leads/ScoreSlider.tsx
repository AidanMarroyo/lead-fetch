'use client';

import { Slider } from '../ui/slider';
import { useState, useEffect } from 'react';

type Props = {
  value: [number, number];
  onChange: (range: [number, number]) => void;
};

export function ScoreSlider({ value, onChange }: Props) {
  const [range, setRange] = useState<[number, number]>(value);

  useEffect(() => {
    onChange(range);
  }, [range, onChange]);

  return (
    <div className='w-full'>
      <label className='text-sm font-medium mb-1 block'>Score Range</label>
      <Slider
        min={0}
        max={100}
        step={5}
        value={range}
        onValueChange={(val) => setRange(val as [number, number])}
        minStepsBetweenThumbs={10}
      />
      <div className='text-xs text-muted-foreground mt-1'>
        {range[0]} — {range[1]}
      </div>
    </div>
  );
}
