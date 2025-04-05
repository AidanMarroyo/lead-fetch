import { getUserSubscription } from '@/lib/subscriptions';
import { redirect } from 'next/navigation';

export async function protectCRMAccess() {
  const sub = await getUserSubscription();

  if (!sub || (sub.plan !== 'individual' && sub.plan !== 'team')) {
    redirect('/api/redirect-to-leads');
  }
}
