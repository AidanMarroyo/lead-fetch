'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

import { toast } from 'sonner';
import { saveGoogleAnalysis } from '@/actions/saveGoogleAnalysis';

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
  reviews?: string[];
};

type Review = { text: string };

export function GoogleProfileImprovement({
  place,
  reviews,
  googlePlaceId,
  address,
}: {
  place: Place;
  reviews?: Review[];
  googlePlaceId?: string;
  address: string;
}) {
  const api = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log('Google Audit Place Send', place);

  const runAnalysis = async () => {
    try {
      setLoading(true);

      if (!api) {
        throw new Error('API URL is not defined');
      }

      const analysisRes = await fetch(`${api}/google-profile-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, reviews, googlePlaceId, address }),
      });

      const data = await analysisRes.json();
      if (!data.success) return toast.error('Profile analysis failed.');

      const saveRes = await saveGoogleAnalysis({
        analysis: data.analysis,
        placeId: googlePlaceId || '',
      });

      if (saveRes.success) {
        toast.success('Profile analysis saved successfully!');
        setAnalysis(data.analysis);
      } else {
        toast.error('Failed to save profile analysis.');
      }
    } catch (error) {
      console.error(error);
      setAnalysis((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-6'>
      <h3 className='text-sm font-semibold mb-2'>🔍 AI Suggestions</h3>
      <Button variant='outline' disabled={loading} onClick={runAnalysis}>
        {loading ? (
          <span className='flex items-center gap-2'>
            <Loader2 className='animate-spin h-4 w-4' />
            Generating...
          </span>
        ) : (
          '📊 Generate Google Analysis'
        )}
      </Button>

      {analysis && (
        <pre className='text-sm whitespace-pre-wrap text-muted-foreground bg-muted rounded-lg p-4 border border-border mt-4'>
          {analysis}
        </pre>
      )}
    </div>
  );
}
