import Pricing from '@/components/marketing/Pricing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebbedLeads Pricing – Plans for Freelancers & Teams',
  description:
    'Choose the right plan for your lead generation needs. Start with 10 free leads, or upgrade for unlimited AI-powered discovery.',
};

export default function PricingPage() {
  return (
    <main>
      <Pricing />
    </main>
  );
}
