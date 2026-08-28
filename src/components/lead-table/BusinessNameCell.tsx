import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LeadProfileAudit, Place } from '../crm-board/lead-profile-audit';

import { getPlaceDetails } from '@/actions/getPlaceDetails';
import { useUserPlan } from '@/lib/userUserPlan';

interface BusinessNameCellProps {
  lead: {
    name: string;

    google_place_id?: string;

    address?: string;
  };
}

export const BusinessNameCell: React.FC<BusinessNameCellProps> = ({ lead }) => {
  const [place, setPlace] = useState<Place | null>(null);
  const { plan } = useUserPlan();
  const [loading, setLoading] = useState(false);

  const fetchAudit = async () => {
    if (place || loading) return; // prevent double-fetch

    setLoading(true);

    try {
      if (lead.google_place_id) {
        const fetched = await getPlaceDetails(lead.google_place_id);

        setPlace(fetched);
      }
    } catch (error) {
      console.error('Error fetching place details', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip onOpenChange={(open) => open && fetchAudit()}>
      <TooltipTrigger asChild>
        <span className='text-blue-600 hover:underline cursor-pointer'>
          {lead.name}
        </span>
      </TooltipTrigger>

      <TooltipContent className='p-2'>
        {loading ? (
          <div className='flex flex-col items-center justify-center p-4 min-w-[200px] min-h-[100px]'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mb-2' />
            <p className='text-xs text-white'>Fetching Google Profile...</p>
          </div>
        ) : place ? (
          <>
            <LeadProfileAudit
              lead={place}
              address={lead.address || ''}
              compact={true}
              plan={plan}
            />
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${lead.google_place_id}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block text-xs text-white hover:underline mt-2 ml-1'
            >
              View on Google Maps
            </a>
          </>
        ) : (
          <div className='text-xs text-muted-foreground p-2'>
            No audit available.
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
