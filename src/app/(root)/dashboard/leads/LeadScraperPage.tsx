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
  SelectItem,
} from '@/components/ui/select';

import { LeadTable } from '@/components/lead-table/table';
import { LeadFilters } from '@/components/leads/LeadFilter';
import { LeadFilter } from '@/lib/types';
import { LeadsMap } from '@/components/leads/LeadsMap'; // ✅ NEW
import { LeadScoreLegend } from '@/components/LeadScoreLegend';
import { DownloadCSVButton } from '@/components/leads/DownloadCSVButton';
import { SaveSearchButton } from '@/components/leads/SaveSearchButton';
import { useUserPlan } from '@/lib/userUserPlan';
import { ProTag } from '@/components/ui/ProTag';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function LeadScraperPage() {
  const { plan } = useUserPlan();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [provinceOrState, setProvinceOrState] = useState('');
  const [country, setCountry] = useState('Canada');
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false); // ✅ NEW
  const [filters, setFilters] = useState<LeadFilter>({
    status: undefined,
    location: '',
    minScore: 0,
    maxScore: 100,
  });

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
    const fullLocation =
      `${city}, ${provinceOrState}, ${country}`.toLowerCase();
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

  const handleToggleMap = () => {
    if (plan === 'free') {
      toast.error('Upgrade required to access the map view.');
      return;
    }
    setMapView(!mapView);
  };

  return (
    <main className='max-w-full mx-auto mt-10 p-6 border rounded-lg'>
      <h1 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
        Webbed Leads
        {plan === 'free' && (
          <span className='text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-medium'>
            Free Plan
          </span>
        )}
      </h1>

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

      <div className='flex items-center justify-between mt-10 mb-4'>
        <h2 className='text-xl font-semibold'>Webbed Filter</h2>
        <div className='flex items-center gap-4'>
          {plan !== 'free' ? (
            <DownloadCSVButton filters={filters} />
          ) : (
            <Button
              variant='outline'
              className='relative opacity-50 cursor-not-allowed'
              onClick={() => toast.error('Upgrade required to export leads.')}
            >
              Export CSV{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <ProTag />
                </TooltipTrigger>
                <TooltipContent>Available on Pro Plan</TooltipContent>
              </Tooltip>
            </Button>
          )}

          <Button
            variant='outline'
            onClick={handleToggleMap}
            className='relative'
          >
            {mapView ? 'Table View' : 'Map View'}
            {plan === 'free' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <ProTag />
                </TooltipTrigger>
                <TooltipContent>Available on Pro Plan</TooltipContent>
              </Tooltip>
            )}
          </Button>
        </div>
      </div>

      <LeadFilters onApply={setFilters} />
      {plan !== 'free' ? (
        <SaveSearchButton
          keyword={keyword}
          location={`${city}, ${provinceOrState}`}
        />
      ) : (
        <p className='text-sm text-muted-foreground mt-2'>
          Want to automate lead discovery?{' '}
          <span className='font-medium'>
            Upgrade to Pro{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <ProTag />
              </TooltipTrigger>
              <TooltipContent>Available on Pro Plan</TooltipContent>
            </Tooltip>
          </span>
        </p>
      )}
      <LeadScoreLegend />
      {mapView ? (
        <LeadsMap filters={filters} />
      ) : (
        <LeadTable filters={filters} />
      )}
    </main>
  );
}
