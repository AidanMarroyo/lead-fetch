'use client';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lead } from './types';
import { LeadProfileAudit } from './lead-profile-audit';
import { getPlaceDetails } from '@/actions/getPlaceDetails';
import { createLeadNote } from '@/actions/createLeadNote';
import { getLeadNotes } from '@/actions/getLeadNotes';
import { toast } from 'sonner';
import { Place } from '@/actions/fetchLeads';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeAndSaveLead } from '@/actions/analyzeAndSaveLead';
import { analyzeWebsite } from '@/actions/analyzeWebsite';

type Props = {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
};

export function LeadDetailModal({ lead, onClose, onUpdate }: Props) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<
    {
      id: string;
      message: string;
      author_name: string;
      created_at: string;
    }[]
  >([]);
  const [placeDetails, setPlaceDetails] = useState<Place | null>(null);
  const [websiteData, setWebsiteData] = useState<null | {
    title: string;
    description: string;
    favicon: string;
    usesSSL: boolean;
    url: string;
  }>(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);
  const [competitorData, setCompetitorData] = useState<{
    techStack: string[];
    trafficRank: number | null;
    adSpendEstimate: string | null;
    optimizationLevel: string | null;
    websiteScore: number | null;
    autoPitch?: string;
  } | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (lead.google_place_id) {
        const details = await getPlaceDetails(lead.google_place_id);
        setPlaceDetails(details);
      }

      if (lead.website) {
        const result = await analyzeWebsite(lead.website);
        if (result.success) {
          setWebsiteData(result.data ?? null);
        }
      }

      const notes = await getLeadNotes(lead.id);
      setNotes(notes);

      if (
        lead.ad_spend_estimate ||
        lead.traffic_rank ||
        lead.tech_stack ||
        lead.optimization_level
      ) {
        setCompetitorData({
          techStack: lead.tech_stack || [],
          trafficRank: lead.traffic_rank ?? null,
          adSpendEstimate: lead.ad_spend_estimate ?? null,
          optimizationLevel: lead.optimization_level ?? null,
          websiteScore: lead.website_score ?? null,
          autoPitch: lead.auto_pitch ?? undefined,
        });
      }
    };

    fetchDetails();
  }, [lead]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    await createLeadNote(lead.id, newNote);
    setNewNote('');
    const updated = await getLeadNotes(lead.id);
    setNotes(updated);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
        </DialogHeader>

        <div className='overflow-y-auto pr-2 space-y-4 mt-2'>
          <p className='text-sm text-muted-foreground'>{lead.address}</p>
          <div className='text-xs'>
            <strong>Score:</strong> {lead.score}
            <br />
            <strong>Status:</strong> {lead.status}
            <br />
            {lead.phone && (
              <>
                <strong>Phone:</strong> {lead.phone}
              </>
            )}
          </div>

          {lead.google_place_id && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${lead.google_place_id}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block text-sm text-blue-600 hover:underline mt-1'
            >
              View on Google Maps
            </a>
          )}

          {placeDetails && (
            <LeadProfileAudit lead={placeDetails} address={lead.address} />
          )}
          {websiteData && (
            <div className='border-t pt-4 mt-6 space-y-4'>
              <div className='bg-card'>
                <h3 className='text-sm font-semibold mb-2'>
                  🌐 Website Metadata
                </h3>
                <div className='text-sm space-y-1'>
                  <p>
                    <strong>Title:</strong> {websiteData.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {websiteData.description}
                  </p>
                  <p>
                    <strong>SSL:</strong>{' '}
                    <span
                      className={
                        websiteData.usesSSL ? 'text-green-600' : 'text-red-500'
                      }
                    >
                      {websiteData.usesSSL ? 'Secure (SSL)' : 'Not secure'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Competitor Analysis */}
          <div className='border-t pt-4'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-sm font-semibold'>📈 Website Audit</h3>

              {lead.website && !competitorData && (
                <Button
                  variant='outline'
                  disabled={competitorLoading}
                  onClick={async () => {
                    setCompetitorLoading(true);
                    try {
                      // 🔹 Step 1: Scrape
                      const scrapeRes = await fetch('/api/scrape', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: lead.website }),
                      });

                      const scrapeData = await scrapeRes.json();

                      if (!scrapeData.success) {
                        toast.error('Website scrape failed');
                        return;
                      }

                      // 🔹 Step 2: Run analysis + save to DB
                      const analysisRes = await analyzeAndSaveLead(
                        lead.id,
                        lead.website!,
                        scrapeData
                      );

                      if (!analysisRes.success || !analysisRes.data) {
                        toast.error('Analysis failed');
                        return;
                      }

                      // 🔹 Step 3: Update local state/UI
                      setCompetitorData({
                        techStack: scrapeData.techStack || [],
                        trafficRank: scrapeData.trafficRank ?? null,
                        adSpendEstimate: scrapeData.adSpendEstimate ?? null,
                        optimizationLevel: scrapeData.optimizationLevel ?? null,
                        websiteScore: scrapeData.websiteScore ?? null,
                        autoPitch: analysisRes.data.suggestions,
                      });
                      toast.success('Website audit complete!');
                      const refreshed = await fetch(`/api/leads/${lead.id}`);
                      const updatedLead = await refreshed.json();
                      onUpdate(updatedLead); // rehydrate lead prop for next open
                    } catch (error) {
                      console.error('[scrape + analyze error]', error);
                      toast.error('Something went wrong.');
                    } finally {
                      setCompetitorLoading(false);
                    }
                  }}
                >
                  {competitorLoading ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='animate-spin h-4 w-4' />
                      Generating...
                    </span>
                  ) : (
                    '📊 Generate Full Analysis'
                  )}
                </Button>
              )}
            </div>

            {competitorData ? (
              <div className='space-y-4 text-sm'>
                {/* Website Score Badge */}
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>Website Score:</span>
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-1 rounded',
                      competitorData.websiteScore !== null &&
                        competitorData.websiteScore >= 80
                        ? 'bg-green-100 text-green-800'
                        : competitorData.websiteScore !== null &&
                            competitorData.websiteScore >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    )}
                  >
                    {competitorData.websiteScore}/100
                  </span>
                </div>

                {/* Tech Stack */}
                <div>
                  <span className='font-semibold block mb-1'>Tech Stack:</span>
                  <div className='flex flex-wrap gap-1 text-xs text-foreground'>
                    {competitorData.techStack?.map((tech) => (
                      <span
                        key={tech}
                        className='rounded bg-muted px-2 py-0.5 border text-muted-foreground'
                      >
                        {tech}
                      </span>
                    )) || '—'}
                  </div>
                </div>

                {/* Metrics */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='font-semibold block'>Traffic Rank:</span>
                    <span className='text-muted-foreground'>
                      {competitorData.trafficRank ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold block'>
                      Ad Spend Estimate:
                    </span>
                    <span className='text-muted-foreground'>
                      {competitorData.adSpendEstimate ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold block'>
                      Optimization Level:
                    </span>
                    <span className='capitalize text-muted-foreground'>
                      {competitorData.optimizationLevel ?? '—'}
                    </span>
                  </div>
                </div>

                {/* Auto Pitch */}
                {competitorData.autoPitch && (
                  <div className='rounded-lg border bg-muted p-4 shadow-sm'>
                    <div className='mb-2 flex justify-between items-center'>
                      <h4 className='text-sm font-semibold text-foreground'>
                        📬 AI Pitch Summary
                      </h4>
                      <Button
                        variant='ghost'
                        className='text-xs text-blue-600 hover:underline'
                        onClick={() => {
                          navigator.clipboard.writeText(
                            competitorData.autoPitch ?? ''
                          );
                          toast.success('Pitch copied to clipboard');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className='text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed'>
                      {competitorData.autoPitch}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div>
            <label className='text-sm font-medium'>Internal Notes</label>
            <Textarea
              className='mt-1'
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              placeholder='e.g. Called, receptionist said they’d follow up.'
            />
            <Button
              className='mt-2'
              onClick={handleSaveNote}
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>

            <div className='mt-4 max-h-64 overflow-y-auto space-y-3 pr-2'>
              {notes.map((note) => (
                <div
                  key={note.id}
                  className='p-2 border rounded-md text-sm bg-muted'
                >
                  <div className='text-xs text-muted-foreground mb-1'>
                    {note.author_name} •{' '}
                    {new Date(note.created_at).toLocaleString()}
                  </div>
                  <div>{note.message}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <p className='text-sm text-muted-foreground italic'>
                  No notes yet.
                </p>
              )}
            </div>
          </div>

          <div className='border-t pt-4'>
            <p className='text-sm mb-2 font-medium'>Google Maps</p>
            <iframe
              className='w-full h-64 rounded-md border'
              loading='lazy'
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                lead.address
              )}&output=embed`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
