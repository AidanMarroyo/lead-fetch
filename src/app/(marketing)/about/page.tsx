import { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About WebbedLeads - The Lead Machine for Web Professionals',
  description:
    'Learn how WebbedLeads helps freelancers and agencies grow with intelligent lead sourcing, website audits, and Google Profile insights.',
};

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}
