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
import { Label } from '@/components/ui/label';

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
  const [websiteStatus, setWebsiteStatus] =
    useState<LeadFilter['websiteStatus']>();

  useEffect(() => {
    onApply({
      location: location.toLowerCase(),
      status: status === 'all' ? undefined : status,
      minScore: score[0],
      maxScore: score[1],
      websiteStatus,
    });
  }, [location, status, score, recentOnly, onApply, websiteStatus]);

  function capitalize(status: string | undefined): string {
    if (!status) return '';
    return status
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className='mb-6 rounded-lg border bg-muted/50 px-4 py-4 shadow-sm'>
      <div className='flex flex-wrap gap-4 items-end'>
        <div className='w-48'>
          <Label htmlFor='location' className='text-xs mb-1 block'>
            Location
          </Label>
          <Input
            id='location'
            placeholder='e.g. Toronto'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className='w-40'>
          <Label htmlFor='status' className='text-xs mb-1 block'>
            Status
          </Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Status'>
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
        </div>

        <div className='w-64'>
          <Label className='text-xs block mb-1'>Score Range</Label>
          <Slider
            value={score}
            onValueChange={(value) => setScore([value[0], value[1]])}
            max={100}
            step={5}
            minStepsBetweenThumbs={10}
          />
          <p className='text-xs mt-1 text-muted-foreground'>
            {score[0]} - {score[1]}
          </p>
        </div>

        <div className='flex items-center gap-2 mb-3 '>
          <input
            type='checkbox'
            id='recentOnly'
            checked={recentOnly}
            onChange={() => setRecentOnly(!recentOnly)}
          />
          <Label htmlFor='recentOnly' className='text-sm'>
            Show only leads from this week
          </Label>
        </div>
        <Select
          value={websiteStatus}
          onValueChange={(v) =>
            setWebsiteStatus(v as LeadFilter['websiteStatus'])
          }
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Website Filter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='has'>Has Website</SelectItem>
            <SelectItem value='none'>No Website</SelectItem>
            <SelectItem value='bad'>Bad Website</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
