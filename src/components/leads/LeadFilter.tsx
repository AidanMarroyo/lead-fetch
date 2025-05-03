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
  scrapeKey,
  userId,
}: {
  onApply: (filters: LeadFilter) => void;
  scrapeKey: number;
  userId: string;
}) {
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<StatusOption>('all');
  const [score, setScore] = useState<[number, number]>([0, 100]);
  const [recentOnly, setRecentOnly] = useState(false);
  const [websiteStatus, setWebsiteStatus] =
    useState<LeadFilter['websiteStatus']>();
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [dueOnly, setDueOnly] = useState(true);
  const [assignedTo, setAssignedTo] = useState(userId);
  const [teamMembers, setTeamMembers] = useState<
    {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      teams: { owner_id: string };
    }[]
  >([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch('/api/team/members');
      const data = await res.json();
      setTeamMembers(data.members || []);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    onApply({
      name: name.toLowerCase(),
      location: location.toLowerCase(),
      status: status === 'all' ? undefined : status,
      minScore: score[0],
      maxScore: score[1],
      websiteStatus,
      recentOnly,
      category: category === 'all' ? undefined : category,
      dueOnly,
      assignedTo: assignedTo === 'all' ? undefined : assignedTo,
    });
  }, [
    location,
    status,
    score,
    recentOnly,
    onApply,
    websiteStatus,
    category,
    name,
    dueOnly,
    assignedTo,
  ]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [scrapeKey]);

  function capitalize(status: string | undefined): string {
    if (!status) return '';
    return status
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className='mb-6 rounded-lg border bg-muted/50 px-4 py-4 shadow-sm'>
      <div className='flex flex-wrap gap-4 items-start'>
        <div className='w-48'>
          <Label htmlFor='name' className='text-xs mb-1 block'>
            Business Name
          </Label>
          <Input
            id='name'
            placeholder='Webbed Leads'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='w-48'>
          <Label htmlFor='location' className='text-xs mb-1 block'>
            Location
          </Label>
          <Input
            id='location'
            placeholder='e.g. Toronto'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='w-48'>
          <Label htmlFor='status' className='text-xs mb-1 block'>
            Status
          </Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusOption)}
          >
            <SelectTrigger className='w-full h-10 text-sm'>
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
              <SelectItem value='archived'>Archived</SelectItem>
              <SelectItem value='not interested'>Not interested</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='w-48'>
          <Label htmlFor='websiteStatus' className='text-xs mb-1 block'>
            Website Status
          </Label>
          <Select
            value={websiteStatus}
            onValueChange={(v) =>
              setWebsiteStatus(v as LeadFilter['websiteStatus'])
            }
          >
            <SelectTrigger className='w-full h-10 text-sm'>
              <SelectValue placeholder='All' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='no'>No Website</SelectItem>
              <SelectItem value='has'>Has Website</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='w-48'>
          <Label htmlFor='category' className='text-xs mb-1 block'>
            Category
          </Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger className='w-full h-10 text-sm'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {teamMembers && (
          <div className='w-48'>
            <Label htmlFor='assignedTo' className='text-xs mb-1 block'>
              Assigned To
            </Label>
            <Select value={assignedTo} onValueChange={(v) => setAssignedTo(v)}>
              <SelectTrigger className='w-full h-10 text-sm'>
                <SelectValue placeholder='All Assignees' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name === null || member.last_name === null
                      ? member.email
                      : `${member.first_name} ${member.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='w-64 mt-3'>
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

        <div className='flex items-center gap-2 my-6 '>
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

        <div className='flex items-center gap-2 mb-3'>
          <input
            type='checkbox'
            id='dueOnly'
            checked={dueOnly}
            onChange={() => setDueOnly(!dueOnly)}
          />
          <Label htmlFor='dueOnly' className='text-sm'>
            Show only due leads
          </Label>
        </div>
      </div>
    </div>
  );
}
