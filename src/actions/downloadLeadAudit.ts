'use server';

import LeadAuditPDF from '@/lib/pdf/LeadAuditPDF';
import { createClient } from '@/utils/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { redirect } from 'next/navigation';

export async function downloadLeadAudit(leadId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', user.id)
    .single();

  if (!lead) return null;

  const pdfStream = await renderToBuffer(LeadAuditPDF({ lead }));

  return new Response(pdfStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${lead.name}-audit.pdf"`,
    },
  });
}
