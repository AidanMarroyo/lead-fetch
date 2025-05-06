'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { LeadTable } from '@/components/lead-table/table';
import { LeadFilters } from '@/components/leads/LeadFilter';
import { LeadFilter } from '@/lib/types';
import LeadsMap from '@/components/leads/LeadsMapWrapper';
import { LeadScoreLegend } from '@/components/LeadScoreLegend';
import { useUserPlan } from '@/lib/userUserPlan';
import { ProTag } from '@/components/ui/ProTag';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ScraperForm from './ScraperForm';
import { createClient } from '@/utils/supabase/client';

export default function LeadScraperPage({ userId }: { userId: string }) {
  const { plan, loading } = useUserPlan();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [scrapeKey, setScrapeKey] = useState(0);
  const [mapView, setMapView] = useState(false);
  const [filters, setFilters] = useState<LeadFilter>({
    name: '',
    status: undefined,
    location: '',
    minScore: 0,
    maxScore: 100,
    dueOnly: false,
    assignedTo: undefined,
  });

  const handleToggleMap = () => {
    if (plan === 'free') {
      toast.error('Upgrade required to access the map view.');
      return;
    }
    setMapView(!mapView);
  };

  const handleApplyFilters = useCallback((filters: LeadFilter) => {
    setFilters(filters);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (data?.team_id) {
        setTeamId(data.team_id);
      }
    };

    if (userId) {
      fetchTeam();
    }
  }, [userId]);

  return (
    <main className='max-w-full mx-auto mt-10 p-6 border rounded-lg'>
      <h1 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
        Webbed Leads
        {plan === 'free' && (
          <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium'>
            Free Plan
          </span>
        )}
      </h1>
      <ScraperForm
        plan={plan}
        onScrapeComplete={() => setScrapeKey((prev) => prev + 1)}
        loading={loading}
      />

      <div className='flex items-center justify-between mt-10 mb-4'>
        <h2 className='text-xl font-semibold'>Webbed Filter</h2>
        <div className='flex items-center gap-4'>
          {/* {plan !== 'free' ? (
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
                  <ProTag plan={'pro'} />
                </TooltipTrigger>
                <TooltipContent>Available on Pro Plan</TooltipContent>
              </Tooltip>
            </Button>
          )} */}

          <Button
            variant='outline'
            onClick={handleToggleMap}
            className='relative'
          >
            {mapView ? 'Table View' : 'Map View'}
            {plan === 'free' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <ProTag plan={'pro'} />
                </TooltipTrigger>
                <TooltipContent>Available on Pro Plan</TooltipContent>
              </Tooltip>
            )}
          </Button>
        </div>
      </div>
      <LeadFilters
        onApply={handleApplyFilters}
        scrapeKey={scrapeKey}
        userId={userId}
        filters={filters}
      />

      <LeadScoreLegend />
      {mapView ? (
        <LeadsMap filters={filters} />
      ) : (
        <LeadTable key={scrapeKey} filters={filters} teamId={teamId} />
      )}
    </main>
  );
}
