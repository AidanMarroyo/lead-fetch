import { Metadata } from 'next';
import FeaturesPage from './FeaturesPage';

export const metadata: Metadata = {
  title:
    'WebbedLeads Features – What Makes WebbedLeads a Lead Generation Powerhouse',
  description:
    'Explore the powerful features of WebbedLeads — from AI audits and Google business scanning to CRM tools and map-based prospecting.',
};

export default function Features() {
  return (
    <main>
      <FeaturesPage />
    </main>
  );
}
