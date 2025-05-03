'use client';

import { useState } from 'react';
import { analyzeWebsite } from '@/actions/analyzeWebsite';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserPlan } from '@/lib/userUserPlan';

const api = process.env.NEXT_PUBLIC_SCRAPER_API_URL;

type WebsiteMeta = {
  title: string;
  description: string;
  favicon: string;
  usesSSL: boolean;
  url: string;
};

type AuditResult = {
  techStack: string[];
  trafficRank: number | null;
  adSpendEstimate: string | null;
  optimizationLevel: string | null;
  website_score: number;
  grade: string;
  auto_pitch: string;
};

type GoogleMatch = {
  name: string;
  address: string;
  place_id: string;
  website?: string;
  phone?: string;

  // Fields required for scoring
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text: string[] };
  photos?: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  types?: string[];
};

export default function WebsiteAnalysisPage() {
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<WebsiteMeta | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [match, setMatch] = useState<GoogleMatch | null>(null);
  const [manual, setManual] = useState({ name: '', address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [auditing, setAuditing] = useState(false);

  const { plan } = useUserPlan();

  const handleAudit = async () => {
    if (!url) return toast.error('Enter a website');
    setLoading(true);

    const res = await analyzeWebsite(url);
    if (!res.success || !res.data) {
      toast.error('Website analysis failed');
      setLoading(false);
      return;
    }

    setMeta(res.data);

    try {
      const domain = new URL(res.data.url).hostname.replace(/^www\./, '');
      const gRes = await fetch(`/api/match-place-by-domain?domain=${domain}`);
      const gData = await gRes.json();
      if (gRes.ok && gData.match) setMatch(gData.match);
      else setMatch(null);
    } catch (err) {
      console.error(err);
      setMatch(null);
    }

    setLoading(false);
  };

  const handleFullAudit = async () => {
    if (!url) return;
    setAuditing(true);
    try {
      const res = await fetch(api!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.success) return toast.error('Full audit failed');
      setAudit(data);
      toast.success('Full audit complete!');
    } catch (err) {
      console.error(err);
      toast.error('Error running full audit');
    } finally {
      setAuditing(false);
    }
  };

  const handleSaveLead = async () => {
    if (!meta) return;

    // Use values from Google match or fallbacks
    const leadData = {
      name: match?.name || manual.name || meta.title,
      address: match?.address || manual.address || '',
      phone: match?.phone || manual.phone || null,
      website: meta.url,
      google_place_id: match?.place_id || null,

      // Include full Google profile details if available for scoring
      rating: match?.rating ?? null,
      user_ratings_total: match?.user_ratings_total ?? null,
      opening_hours: match?.opening_hours ?? null,
      photos: match?.photos ?? [],
      types: match?.types ?? [],

      // Include full website audit if run
      ...(audit && {
        tech_stack: audit.techStack || [],
        traffic_rank: audit.trafficRank || null,
        ad_spend_estimate: audit.adSpendEstimate || null,
        optimization_level: audit.optimizationLevel || null,
        website_score: audit.website_score || 0,
        website_grade: audit.grade || null,
        auto_pitch: audit.auto_pitch || null,
      }),
    };

    const res = await fetch('/api/save-lead-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Lead saved!');
      setMeta(null);
      setMatch(null);
      setAudit(null);
      setUrl('');
      setManual({ name: '', address: '', phone: '' });
    } else {
      toast.error(data.error || 'Failed to save lead');
    }
  };

  return (
    <div className='max-w-xl mx-auto p-8 space-y-6'>
      <h1 className='text-2xl font-bold'>🧠 Website Analysis Tool</h1>
      <Input
        placeholder='Enter website URL'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleAudit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze & Match'}
      </Button>

      {meta && (
        <div className='border p-4 rounded space-y-2 bg-muted'>
          <h3 className='font-semibold'>🌐 Website Metadata</h3>
          <p>
            <strong>Title:</strong> {meta.title}
          </p>
          <p>
            <strong>Description:</strong> {meta.description}
          </p>
          <p>
            <strong>URL:</strong> {meta.url}
          </p>
          {['unlimted', 'team'].some((p) => plan.includes(p)) && (
            <Button
              onClick={handleFullAudit}
              disabled={auditing}
              className='mt-3'
              variant='outline'
            >
              {auditing ? 'Running Audit...' : '📊 Generate Full Analysis'}
            </Button>
          )}
        </div>
      )}

      {audit && (
        <div className='border p-4 rounded bg-muted space-y-2 text-sm'>
          <h3 className='font-semibold'>🔍 Audit Results</h3>
          <p>
            <strong>Score:</strong> {audit.website_score}
          </p>
          <p>
            <strong>Grade:</strong> {audit.grade}
          </p>
          <p>
            <strong>Optimization:</strong> {audit.optimizationLevel}
          </p>
          <p>
            <strong>Traffic Rank:</strong> {audit.trafficRank}
          </p>
          <p>
            <strong>Ad Spend:</strong> {audit.adSpendEstimate}
          </p>
          {/* <p>
            <strong>Tech Stack:</strong>
            <div className='flex flex-wrap gap-1 text-xs'>
              {audit.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className='rounded bg-muted px-2 py-0.5 border text-muted-foreground'
                >
                  {tech}
                </span>
              ))}
            </div>
          </p> */}
          {audit.auto_pitch && (
            <div className='bg-muted text-muted-foreground p-3 rounded'>
              <h4 className='font-semibold mb-2'>📬 AI Pitch</h4>
              <p className='text-sm font-semibold whitespace-pre-wrap'>
                {audit.auto_pitch}
              </p>
            </div>
          )}
        </div>
      )}

      {match ? (
        <div className='border p-4 rounded space-y-2 bg-muted'>
          <h3 className='font-semibold'>📍 Matched Google Business</h3>
          <p>
            <strong>Name:</strong> {match.name}
          </p>
          <p>
            <strong>Address:</strong> {match.address}
          </p>
          {match.phone && (
            <p>
              <strong>Phone:</strong> {match.phone}
            </p>
          )}
          <Button onClick={handleSaveLead}>💾 Save as Lead</Button>
        </div>
      ) : (
        meta && (
          <div className='border p-4 rounded space-y-4 bg-muted'>
            <h3 className='font-semibold text-sm'>
              📝 No match found — Enter info manually
            </h3>
            <Input
              placeholder='Business Name'
              value={manual.name}
              onChange={(e) => setManual({ ...manual, name: e.target.value })}
            />
            <Input
              placeholder='Business Address'
              value={manual.address}
              onChange={(e) =>
                setManual({ ...manual, address: e.target.value })
              }
            />
            <Input
              placeholder='Phone Number'
              value={manual.phone}
              onChange={(e) => setManual({ ...manual, phone: e.target.value })}
            />
            <Button onClick={handleSaveLead}>💾 Save as Lead</Button>
          </div>
        )
      )}
    </div>
  );
}
