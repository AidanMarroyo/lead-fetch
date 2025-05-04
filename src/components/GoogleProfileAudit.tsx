'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { analyzeGoogleProfile } from '@/actions/analyzeGoogleProfile';

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
  lead,
  reviews,
  googlePlaceId,
}: {
  lead: Place;
  reviews?: Review[];
  googlePlaceId?: string;
}) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log('googlePlaceId', googlePlaceId);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeGoogleProfile({
        place: lead,
        reviews,
        googlePlaceId,
      });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis('❌ Failed to generate improvement suggestions.');
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
