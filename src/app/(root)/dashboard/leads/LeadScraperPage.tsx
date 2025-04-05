'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fetchLeadsFromGoogle } from '@/actions/fetchLeads';
import { americanStates, canadianProvinces } from '@/utils/constants';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem, // ✅ This one!
} from '@/components/ui/select';
import { LeadTable } from '@/components/lead-table/table';

export default function LeadScraperPage() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [provinceOrState, setProvinceOrState] = useState('');
  const [country, setCountry] = useState('Canada');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const reasonCookie = cookies.find((c) => c.startsWith('redirect_reason='));

    if (reasonCookie && reasonCookie.includes('upgrade')) {
      toast.error('Upgrade required to access the CRM pipeline.');
      document.cookie = 'redirect_reason=; Max-Age=0; path=/';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullLocation = `${city}, ${provinceOrState}, ${country}`;

    const result = await fetchLeadsFromGoogle({
      keyword,
      location: fullLocation,
    });

    setLoading(false);

    if (result?.success) {
      toast.success(`${result.count} leads found and stored`);
    } else {
      toast.error(`${result.message}`);
    }
  };

  const regionList = country === 'Canada' ? canadianProvinces : americanStates;

  return (
    <main className='max-w-full mx-auto mt-10 p-6 border rounded-lg'>
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
          <Label htmlFor='city'>City</Label>
          <Input
            id='city'
            placeholder='e.g. Toronto'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor='provinceOrState'>Province/State</Label>
          <Select
            onValueChange={(value) => setProvinceOrState(value)}
            value={provinceOrState}
          >
            <SelectTrigger className='w-full border p-2 rounded-md'>
              <SelectValue
                placeholder={country === 'Canada' ? 'Province' : 'State'}
              />
            </SelectTrigger>
            <SelectContent>
              {regionList.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='country'>Country</Label>
          <Select onValueChange={(value) => setCountry(value)} value={country}>
            <SelectTrigger className='w-full border p-2 rounded-md'>
              <SelectValue placeholder='Select Country' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Canada'>Canada</SelectItem>
              <SelectItem value='USA'>USA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type='submit' disabled={loading}>
          {loading ? 'Searching...' : 'Find Leads'}
        </Button>
      </form>
      <LeadTable />
    </main>
  );
}
