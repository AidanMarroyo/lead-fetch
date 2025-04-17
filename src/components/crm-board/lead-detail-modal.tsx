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
import { analyzeWebsite } from '@/actions/analyzeWebsite';
import { useUserPlan } from '@/lib/userUserPlan';
import { saveAnalysis } from '@/actions/saveAnalysis';

type Props = {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
};

export function LeadDetailModal({ lead, onClose, onUpdate }: Props) {
  const api = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
  const { plan } = useUserPlan();
  const [internalLead, setInternalLead] = useState(lead);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<
    { id: string; message: string; author_name: string; created_at: string }[]
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
  const [loading, setLoading] = useState(true);

  const {
    tech_stack,
    traffic_rank,
    ad_spend_estimate,
    optimization_level,
    website_score,
    auto_pitch,
  } = internalLead;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [place, meta, leadNotes] = await Promise.all([
          internalLead.google_place_id
            ? getPlaceDetails(internalLead.google_place_id)
            : null,
          internalLead.website ? analyzeWebsite(internalLead.website) : null,
          getLeadNotes(internalLead.id),
        ]);

        if (place) setPlaceDetails(place);
        if (meta?.success && meta.data) setWebsiteData(meta.data);
        setNotes(leadNotes);
      } catch (err) {
        console.error('[Fetch Details Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [internalLead]);

  const handleGenerateAudit = async () => {
    try {
      setCompetitorLoading(true);

      if (!api) {
        throw new Error('API URL is not defined');
      }

      const scrapeRes = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: internalLead.website }),
      });

      const data = await scrapeRes.json();
      if (!data.success) return toast.error('Website scrape failed');
      console.log('[Scrape Result]', data);

      const updatedLead = {
        ...internalLead,
        tech_stack: data.techStack,
        traffic_rank: data.trafficRank,
        ad_spend_estimate: data.adSpendEstimate,
        optimization_level: data.optimizationLevel,
        website_score: data.website_score,
        website_grade: data.grade,
        auto_pitch: data.auto_pitch,
      };

      // Save to DB
      const saveRes = await saveAnalysis(updatedLead);
      if (!saveRes.success) return toast.error('Failed to save analysis');

      const refreshed = await fetch(`/api/leads/${internalLead.id}`);
      const updated = await refreshed.json();

      setInternalLead(updated); // Keep modal in-place
      onUpdate(updated); // Let Kanban board rehydrate
      toast.success('Website audit complete!');
    } catch (err) {
      console.error('[Audit Error]', err);
      toast.error('Something went wrong.');
    } finally {
      setCompetitorLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    await createLeadNote(internalLead.id, newNote);
    setNewNote('');
    const updatedNotes = await getLeadNotes(internalLead.id);
    setNotes(updatedNotes);
  };

  const formattedPitch = auto_pitch
    ?.replace(/\n+/g, ' ') // Remove accidental newlines
    .replace(/(\d+)\s*\.\s*/g, '\n\n$1. ') // Add line breaks before each numbered point
    .trim();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        {loading ? (
          <ModalLoadingSkeleton />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{internalLead.name}</DialogTitle>
            </DialogHeader>

            <div className='overflow-y-auto pr-2 space-y-4 mt-2'>
              <p className='text-sm text-muted-foreground'>
                {internalLead.address}
              </p>
              <div className='text-xs'>
                <strong>Score:</strong> {internalLead.score}
                <br />
                <strong>Status:</strong> {internalLead.status}
                <br />
                {internalLead.phone && (
                  <>
                    <strong>Phone:</strong> {internalLead.phone}
                  </>
                )}
              </div>

              {internalLead.google_place_id && (
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${internalLead.google_place_id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-block text-sm text-blue-600 hover:underline mt-1'
                >
                  View on Google Maps
                </a>
              )}

              {plan !== 'free' && placeDetails && (
                <LeadProfileAudit
                  lead={placeDetails}
                  address={internalLead.address}
                />
              )}

              {plan !== 'free' && websiteData && (
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
                            websiteData.usesSSL
                              ? 'text-green-600'
                              : 'text-red-500'
                          }
                        >
                          {websiteData.usesSSL ? 'Secure (SSL)' : 'Not secure'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {plan !== 'free' && (
                <div className='border-t pt-4'>
                  {internalLead.website && !tech_stack?.length && (
                    <div className='flex justify-between items-center mb-3'>
                      <h3 className='text-sm font-semibold'>
                        📈 Website Audit
                      </h3>
                      <Button
                        variant='outline'
                        disabled={competitorLoading}
                        onClick={handleGenerateAudit}
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
                    </div>
                  )}

                  {(tech_stack ?? []).length > 0 && (
                    <div className='space-y-4 text-sm'>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold'>Website Score:</span>
                        <span
                          className={cn(
                            'text-xs font-bold px-2 py-1 rounded',
                            (website_score ?? 0) >= 80
                              ? 'bg-green-100 text-green-800'
                              : (website_score ?? 0) >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          )}
                        >
                          {website_score}/100
                        </span>
                      </div>

                      <div>
                        <span className='font-semibold block mb-1'>
                          Tech Stack:
                        </span>
                        <div className='flex flex-wrap gap-1 text-xs'>
                          {tech_stack?.map((tech: string) => (
                            <span
                              key={tech}
                              className='rounded bg-muted px-2 py-0.5 border text-muted-foreground'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <span className='font-semibold'>Traffic Rank: </span>
                          <span className='text-muted-foreground'>
                            {traffic_rank ?? '—'}
                          </span>
                        </div>
                        <div>
                          <span className='font-semibold'>Ad Spend: </span>
                          <span className='text-muted-foreground'>
                            {ad_spend_estimate ?? '—'}
                          </span>
                        </div>
                        <div>
                          <span className='font-semibold'>
                            Optimization Level:{' '}
                          </span>
                          <span className='text-muted-foreground capitalize'>
                            {optimization_level ?? '—'}
                          </span>
                        </div>
                      </div>

                      {formattedPitch && (
                        <div className='border bg-muted p-4 rounded'>
                          <div className='flex justify-between items-center mb-2'>
                            <h4 className='text-sm font-semibold'>
                              📬 AI Pitch Summary
                            </h4>
                            <Button
                              variant='ghost'
                              onClick={() => {
                                navigator.clipboard.writeText(formattedPitch);
                                toast.success('Pitch copied to clipboard');
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                            {formattedPitch}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
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
                      className='p-2 border rounded bg-muted text-sm'
                    >
                      <div className='text-xs text-muted-foreground mb-1'>
                        {note.author_name} •{' '}
                        {new Date(note.created_at).toLocaleString()}
                      </div>
                      <div>{note.message}</div>
                    </div>
                  ))}
                </div>
              </div>
              {plan === 'free' && (
                <div className='border-t pt-4'>
                  <div className='bg-muted border text-sm text-muted-foreground p-4 rounded'>
                    🔒 Upgrade to Pro to unlock website audits, Google profile
                    analysis, and AI-powered recommendations.
                  </div>
                </div>
              )}

              <div className='border-t pt-4'>
                <p className='text-sm font-medium mb-2'>Google Maps</p>
                <iframe
                  className='w-full h-64 rounded border'
                  loading='lazy'
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    internalLead.address
                  )}&output=embed`}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ModalLoadingSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      <div className='h-5 bg-muted w-1/3 rounded' />
      <div className='h-3 bg-muted w-1/2 rounded' />
      <div className='h-3 bg-muted w-1/4 rounded' />
      <div className='h-64 bg-muted rounded' />
    </div>
  );
}
