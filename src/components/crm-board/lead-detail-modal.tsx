'use client';

import { Lead } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { updateLeadNotes } from '@/actions/updateLeadNotes';
import { LeadProfileAudit } from '../lead-profile-audit';
import { getPlaceDetails } from '@/actions/getPlaceDetails';
import { scoreLead } from '@/lib/scoring';

type Props = {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
};

export function LeadDetailModal({ lead, onClose, onUpdate }: Props) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  console.log('place details:', placeDetails);

  const handleSave = async () => {
    setSaving(true);
    const updated = await updateLeadNotes(lead.id, notes);
    setSaving(false);
    onUpdate({ ...lead, notes: updated.notes });
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!lead.google_place_id) return;

      const details = await getPlaceDetails(lead.google_place_id);
      setPlaceDetails(details);
    };

    fetchDetails();
  }, [lead.google_place_id]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-4'>
          <p className='text-sm text-muted-foreground'>{lead.address}</p>
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
          {/* <LeadProfileAudit lead={{ ...lead, phone: lead.phone || '' }} /> */}
          {placeDetails && <LeadProfileAudit lead={placeDetails} />}

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

          <div>
            <label className='text-sm font-medium'>Internal Notes</label>
            <Textarea
              className='mt-1'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder='e.g. Spoke to receptionist, interested in web revamp.'
            />
            <Button className='mt-2' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Notes'}
            </Button>
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
