import FAQ from '@/components/marketing/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebbedLeads FAQ – Get Answers to Common Questions',
  description:
    'Find answers to frequently asked questions about plans, lead generation, AI audits, billing, and more.',
};

export default function FAQPage() {
  return (
    <main>
      <FAQ />
    </main>
  );
}
