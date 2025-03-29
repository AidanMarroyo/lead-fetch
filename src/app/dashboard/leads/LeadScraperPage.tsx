'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fetchLeadsFromGoogle } from '@/actions/fetchLeads';

export default function LeadScraperPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await fetchLeadsFromGoogle({ keyword, location });

    setLoading(false);

    if (result?.success) {
      toast.success(`${result.count} leads found and stored`);
    } else {
      toast.error(`${result.message}`);
    }
  };

  return (
    <main className='max-w-xl mx-auto mt-10 p-6 border rounded-lg'>
      <h1 className='text-2xl font-semibold mb-4'>Lead Scrapper</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='keyword'>Business Type</Label>
          <Input
            id='keyword'
            placeholder='e.g. Plumber'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor='location'>Location</Label>
          <Input
            id='location'
            placeholder='e.g. New York, NY'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type='submit' disabled={loading}>
          {loading ? 'Searching...' : 'Find Leads'}
        </Button>
      </form>
    </main>
  );
}
