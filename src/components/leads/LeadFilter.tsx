import { useState } from 'react';
import { LeadFilter } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [score, setScore] = useState([0, 100]);

  const handleApply = () => {
    onApply({
      location,
      status: status === 'all' ? undefined : status,
      minScore: score[0],
      maxScore: score[1],
    });
  };

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
            <SelectValue placeholder='Status' />
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
            onValueChange={setScore}
            max={100}
            step={5}
            minStepsBetweenThumbs={10}
          />
          <p className='text-xs mt-1'>
            {score[0]} - {score[1]}
          </p>
        </div>

        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
}
