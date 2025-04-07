'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        'data-[disabled]:opacity-50',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot='slider-track'
        className={cn(
          'relative grow overflow-hidden rounded-full bg-muted',
          'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2'
        )}
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className='absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot='slider-thumb'
          className='block size-4 rounded-full border border-border bg-background shadow-sm transition ring-offset-background hover:ring-4 focus-visible:ring-4 ring-ring/50 focus:outline-none'
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
