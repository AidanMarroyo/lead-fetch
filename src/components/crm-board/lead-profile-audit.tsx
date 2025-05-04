import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { LeadAuditPDF } from '@/lib/pdf/LeadAuditPDF';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { GoogleProfileImprovement } from '../GoogleProfileAudit';

type LeadPhoto = {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
};

export type Place = {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text: string[]; open_now?: boolean };
  photos?: LeadPhoto[];
  types?: string[];
  place_id?: string;
  address: string;
  formatted_phone_number?: string;
  website?: string;
  score?: number;
  phone?: string;
  google_place_id?: string;
  reviews?: string[];
  google_analysis?: string;
};

export function LeadProfileAudit({
  lead,
  address,
  compact = false, // ✅ NEW: allow compact mode
  googlePlaceId,
}: {
  lead: Place;
  address: string;
  compact?: boolean;
  googlePlaceId?: string;
}) {
  const auditItems = [
    {
      label: 'Has Website',
      value: !!lead.website,
    },
    {
      label: 'Has Phone Number',
      value: !!lead.formatted_phone_number,
    },
    {
      label: 'Has Business Hours',
      value:
        !!lead.opening_hours &&
        ((lead.opening_hours.weekday_text?.length ?? 0) > 0 ||
          'open_now' in lead.opening_hours),
    },
    {
      label: 'Has Valid Photos',
      value:
        Array.isArray(lead.photos) &&
        lead.photos.length > 0 &&
        lead.photos.every((photo) => !!photo.photo_reference),
    },
    {
      label: 'Has Business Categories',
      value:
        Array.isArray(lead.types) &&
        lead.types.length > 0 &&
        lead.types.some(
          (type) => typeof type === 'string' && type.trim() !== ''
        ),
    },
    {
      label: `Has 10+ Reviews (${lead.user_ratings_total ?? 0})`,
      value:
        typeof lead.user_ratings_total === 'number' &&
        lead.user_ratings_total >= 10,
    },
    {
      label: `Rating +4.0 stars (${lead.rating ? `${lead.rating} stars` : 'N/A'})`,
      value: typeof lead.rating === 'number' ? lead.rating >= 4.0 : false,
    },
  ];

  console.log('GoogleProfileImprovement', googlePlaceId);
  return (
    <div
      className={
        compact
          ? 'p-3 rounded-md bg-white shadow-md text-black dark:bg-gray-900 dark:text-white'
          : 'mt-6 border-t pt-4'
      }
      style={compact ? { maxWidth: '250px' } : {}}
    >
      <h3 className='text-sm font-semibold mb-2'>🧾 Google Profile Audit</h3>
      <ul className='space-y-2 text-sm'>
        {auditItems.map((item, i) => (
          <li key={i} className='flex items-center gap-2'>
            {item.value ? (
              <Check className='text-green-600 w-4 h-4' />
            ) : (
              <X className='text-red-500 w-4 h-4' />
            )}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      {!compact && (
        <GoogleProfileImprovement
          place={lead}
          reviews={lead.reviews?.map((review) => ({ text: review }))}
          googlePlaceId={googlePlaceId}
        />
      )}
      {!compact
        ? null
        : lead?.google_analysis && ( // ✅ Only show download button outside tooltips
            <div className='mt-4 flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={async () => {
                  if (!lead) return toast.error('Missing place details');

                  const blob = await pdf(
                    <LeadAuditPDF lead={lead} address={address} />
                  ).toBlob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${lead.name}-audit.pdf`;
                  link.click();
                }}
              >
                Download Audit Report (PDF)
              </Button>
            </div>
          )}
    </div>
  );
}
