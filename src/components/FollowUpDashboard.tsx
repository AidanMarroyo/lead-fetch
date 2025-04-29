'use client';

import { useEffect, useState } from 'react';
import { Lead } from '@/components/crm-board/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { logFollowUp } from '@/actions/logFollowup'; // ✅ we'll create this
import { Loader2 } from 'lucide-react';

export default function FollowUpDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDueLeads = async () => {
      try {
        const res = await fetch('/api/leads/followup-leads');
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        toast.error('Failed to load follow-ups');
        console.error('Failed to load follow-ups', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDueLeads();
  }, []);

  const handleLogFollowUp = async (leadId: string) => {
    try {
      await logFollowUp(leadId);
      toast.success('Follow-up logged');

      // ✅ Update UI immediately
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      console.error('Failed to log follow-up', err);
      toast.error('Failed to log follow-up');
    }
  };

  return (
    <main className='max-w-5xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-6'>📞 Follow-Up Dashboard</h1>

      {loading ? (
        <div className='flex justify-center items-center h-40 text-muted-foreground'>
          <Loader2 className='h-6 w-6 animate-spin mr-2' />
          Loading follow-ups...
        </div>
      ) : leads.length === 0 ? (
        <p className='text-center text-muted-foreground'>
          🎉 No follow-ups due today!
        </p>
      ) : (
        <div className='space-y-4'>
          {leads.map((lead) => (
            <div
              key={lead.id}
              className='flex items-center justify-between p-4 border rounded-lg bg-muted'
            >
              <div>
                <h2 className='text-lg font-bold'>{lead.name}</h2>
                <p className='text-sm text-muted-foreground'>{lead.address}</p>
                {lead.contact_attempts >= 0 && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Follow-up Attempts: {lead.contact_attempts}
                  </p>
                )}
              </div>
              <Button onClick={() => handleLogFollowUp(lead.id)}>
                Log Follow-Up
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
