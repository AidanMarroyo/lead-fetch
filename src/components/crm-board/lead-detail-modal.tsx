'use client';
import { useEffect, useState, useTransition } from 'react';
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
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { logFollowUp } from '@/actions/logFollowup';
import { getNextFollowUpDate } from '@/lib/followup';

type Props = {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
};

export function LeadDetailModal({ lead, onClose, onUpdate }: Props) {
  const api = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
  const [confirmAction, setConfirmAction] = useState<
    'not_interested' | 'archived' | null
  >(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
  const [isPending, startTransition] = useTransition();

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

      const scrapeRes = await fetch(`${api}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: internalLead.website }),
      });

      const data = await scrapeRes.json();
      if (!data.success) return toast.error('Website scrape failed');

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

  const handleLogFollowUp = () => {
    startTransition(async () => {
      try {
        startTransition(async () => {
          try {
            await logFollowUp(internalLead.id);
            setInternalLead((prev) => ({
              ...prev,
              contact_attempts: (prev.contact_attempts ?? 0) + 1,
              last_contacted_at: new Date().toISOString(),
              next_follow_up_date: getNextFollowUpDate(
                prev.contact_attempts + 1
              ),
            }));
            toast.success('Follow-up logged.');
          } catch (err) {
            console.error(err);
            toast.error('Failed to log follow-up.');
          }
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to log follow-up.');
      }
    });
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    await createLeadNote(internalLead.id, newNote);
    setNewNote('');
    const updatedNotes = await getLeadNotes(internalLead.id);
    setNotes(updatedNotes);
    handleLogFollowUp();
  };

  const updateStatus = async (newStatus: 'not interested' | 'archived') => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/update-lead-status', {
        method: 'POST',
        body: JSON.stringify({ id: internalLead.id, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updated = { ...internalLead, status: newStatus };
      setInternalLead(updated);
      onUpdate(updated);
      toast.success(`Status updated to "${newStatus}"`);
      setConfirmAction(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formattedPitch = auto_pitch
    ?.replace(/\n+/g, ' ') // Remove accidental newlines
    .replace(/(\d+)\s*\.\s*/g, '\n\n$1. ') // Add line breaks before each numbered point
    .trim();

  const today = new Date().toLocaleDateString().split('T')[0];

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
              {isPending ? (
                <Loader2 className='animate-spin h-4 w-4' />
              ) : (
                <div className='text-xs flex items-center gap-2'>
                  <span className='text-muted-foreground'>
                    Attempts: {internalLead.contact_attempts ?? 0}
                  </span>

                  <div className='text-xs text-muted-foreground'>
                    Next Recommended Follow-Up:{' '}
                    {internalLead.contact_attempts === 0
                      ? today
                      : internalLead.next_follow_up_date
                        ? new Date(internalLead.next_follow_up_date)
                            .toISOString()
                            .split('T')[0]
                        : today}
                  </div>
                </div>
              )}

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
                  googlePlaceId={internalLead.google_place_id}
                  reviews={internalLead.reviews}
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

              {['unlimted', 'team'].some((p) => plan.includes(p)) && (
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

                  {(tech_stack ?? []).length > 0 ||
                    (auto_pitch && (
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

                        {/* <div>
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
                      </div> */}

                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <span className='font-semibold'>
                              Traffic Rank:{' '}
                            </span>
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
                              {auto_pitch}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
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
              <div className='flex gap-4 mt-6'>
                <Button
                  variant='destructive'
                  onClick={() => setConfirmAction('not_interested')}
                >
                  Mark as Not Interested
                </Button>
                <Button onClick={() => setConfirmAction('archived')}>
                  Archive Lead
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
      {confirmAction && (
        <Dialog open onOpenChange={() => setConfirmAction(null)}>
          <DialogContent className='max-w-sm text-center'>
            <DialogHeader>
              <DialogTitle>
                Confirm{' '}
                {confirmAction === 'archived' ? 'Archive' : 'Not Interested'}
              </DialogTitle>
            </DialogHeader>
            <p className='text-sm text-muted-foreground mb-4'>
              Are you sure you want to mark this lead as{' '}
              <strong>
                {confirmAction === 'archived' ? 'Archived' : 'Not Interested'}
              </strong>
              ?
            </p>
            <div className='flex justify-end gap-2 mt-4'>
              <Button
                variant='ghost'
                onClick={() => setConfirmAction(null)}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() =>
                  updateStatus(
                    confirmAction === 'archived' ? 'archived' : 'not interested'
                  )
                }
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

function ModalLoadingSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      <VisuallyHidden>
        <DialogTitle>Loading lead details</DialogTitle>
      </VisuallyHidden>
      <div className='h-5 bg-muted w-1/3 rounded' />
      <div className='h-3 bg-muted w-1/2 rounded' />
      <div className='h-3 bg-muted w-1/4 rounded' />
      <div className='h-64 bg-muted rounded' />
    </div>
  );
}
