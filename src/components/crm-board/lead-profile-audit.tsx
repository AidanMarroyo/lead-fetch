import { Check, X } from 'lucide-react';

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
  opening_hours?: { weekday_text?: string[]; open_now?: boolean };
  photos?: LeadPhoto[];
  types?: string[];
  place_id?: string;
  address: string;
  formatted_phone_number?: string;
  website?: string;
  score?: number;
  phone?: string;
};

export function LeadProfileAudit({ lead }: { lead: Place }) {
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
      label: `Rating 4.0+ (${lead.rating ?? 'N/A'})`,
      value: typeof lead.rating === 'number' ? lead.rating >= 4.0 : false,
    },
  ];

  return (
    <div className='mt-6 border-t pt-4'>
      <h3 className='text-sm font-semibold mb-2 text-foreground'>
        🧾 Profile Audit
      </h3>
      <ul className='space-y-2 text-sm'>
        {auditItems.map((item, i) => (
          <li key={i} className='flex items-center gap-2'>
            {item.value ? (
              <Check className='text-green-600 w-4 h-4' />
            ) : (
              <X className='text-red-500 w-4 h-4' />
            )}
            <span className='text-muted-foreground'>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
