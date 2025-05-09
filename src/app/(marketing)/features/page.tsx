import { Metadata } from 'next';
import FeaturesPage from './FeaturesPage';

export const metadata: Metadata = {
  title:
    'WebbedLeads Features – What Makes WebbedLeads a Lead Generation Powerhouse',
  description:
    'Explore the powerful features of WebbedLeads — from AI audits and Google business scanning to CRM tools and map-based prospecting.',
  keywords: [
    'WebbedLeads features',
    'AI website audits',
    'find businesses without websites',
    'lead scoring tools',
    'local business leads',
    'automated prospecting',
    'smart outreach tools',
    'SEO lead generation',
    'freelancer sales tools',
    'web agency growth features',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com'
  ),
  openGraph: {
    title: 'WebbedLeads Features – AI Lead Discovery for Agencies',
    description:
      'Explore powerful features built for web agencies and freelancers: AI audits, smart lead filters, local business detection, and more.',
    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/features` ||
      'https://www.webbedleads.com/features',
    siteName: 'WebbedLeads',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'WebbedLeads – Explore Features',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebbedLeads Features – Designed for Web Agencies & Freelancers',
    description:
      'Discover how WebbedLeads helps you win more clients with AI-powered lead generation and conversion-focused tools.',
    images: ['/banner.png'],
    creator: '@WebbedLeads',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical:
      `${process.env.NEXT_PUBLIC_SITE_URL}/features` ||
      'https://www.webbedleads.com/features',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function Features() {
  return (
    <main>
      <FeaturesPage />
    </main>
  );
}
