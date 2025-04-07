'use client';
import { useEffect, useState } from 'react';
import { LeadFilter } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

type StatusOption = LeadFilter['status'];

export function LeadFilters({
  onApply,
}: {
  onApply: (filters: LeadFilter) => void;
}) {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<StatusOption>('all');
  const [score, setScore] = useState<[number, number]>([0, 100]);
  const [recentOnly, setRecentOnly] = useState(false);

  useEffect(() => {
    onApply({
      location: location.toLowerCase(),
      status: status === 'all' ? undefined : status,
      minScore: score[0],
      maxScore: score[1],
    });
  }, [location, status, score]);

  function capitalize(status: string | undefined): string {
    if (!status) return '';
    return status
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className='space-y-4 mb-6'>
      <div className='flex gap-4 items-end'>
        <Input
          placeholder='Location (e.g. Toronto)'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusOption)}
        >
          <SelectTrigger className='w-40'>
            <SelectValue>
              {status === 'all' ? 'Status' : capitalize(status)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Select All</SelectItem>
            <SelectItem value='new'>New</SelectItem>
            <SelectItem value='contacted'>Contacted</SelectItem>
            <SelectItem value='in progress'>In Progress</SelectItem>
            <SelectItem value='closed'>Closed</SelectItem>
          </SelectContent>
        </Select>

        <div className='w-64'>
          <label className='text-xs block mb-1'>Score Range</label>
          <Slider
            value={score}
            onValueChange={(value) => setScore([value[0], value[1]])}
            max={100}
            step={5}
            minStepsBetweenThumbs={10}
          />
          <p className='text-xs mt-1'>
            {score[0]} - {score[1]}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='recentOnly'
            checked={recentOnly}
            onChange={() => setRecentOnly(!recentOnly)}
          />
          <label htmlFor='recentOnly' className='text-sm'>
            Show only leads from this week
          </label>
        </div>
      </div>
    </div>
  );
}
