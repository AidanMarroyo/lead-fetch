import Pricing from '@/components/marketing/Pricing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebbedLeads Pricing – Plans for Freelancers & Teams',
  description:
    'Choose the right plan for your lead generation needs. Start with 10 free leads, or upgrade for unlimited AI-powered discovery.',
  keywords: [
    'WebbedLeads pricing',
    'lead generation plans',
    'web agency tools pricing',
    'AI lead platform cost',
    'SEO client prospecting plans',
    'freelancer outreach pricing',
    'local business leads subscription',
    'web design lead generation',
    'WebbedLeads free trial',
    'AI-powered prospecting tool pricing',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com'
  ),
  openGraph: {
    title: 'WebbedLeads Pricing – Start Free, Grow Faster',
    description:
      'Get started with 3 days of Pro features free. Explore affordable plans tailored for freelancers and web agencies.',
    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/pricing` ||
      'https://www.webbedleads.com/pricing',
    siteName: 'WebbedLeads',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'WebbedLeads – Pricing Plans',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebbedLeads Pricing – Flexible Plans for Freelancers & Agencies',
    description:
      'Start with free AI-powered lead discovery. Upgrade anytime to unlock unlimited features and grow your web business.',
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
      `${process.env.NEXT_PUBLIC_SITE_URL}/pricing` ||
      'https://www.webbedleads.com/pricing',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function PricingPage() {
  return (
    <main>
      <Pricing />
    </main>
  );
}
