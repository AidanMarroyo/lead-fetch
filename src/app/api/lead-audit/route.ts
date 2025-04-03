import { downloadLeadAudit } from '@/actions/downloadLeadAudit';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();
  const response = await downloadLeadAudit(leadId);
  return response ?? new Response('Not found', { status: 404 });
}
