import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import { Providers } from './theme-provider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebbedLeads – AI-Powered Lead Discovery for Freelancers & Agencies',
  description:
    'Discover high-quality leads instantly with WebbedLeads. Our AI-powered platform finds businesses without websites so you can pitch and close faster.',
  keywords: [
    'lead generation',
    'website audits',
    'SEO leads',
    'Google business leads',
    'web agency tools',
    'find businesses without websites',
    'AI lead scoring',
    'local business outreach',
    'sales prospecting tools',
    'freelancer growth',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com'
  ),
  openGraph: {
    title: 'WebbedLeads – AI-Powered Lead Generation for Agencies',
    description:
      'Discover local businesses without websites. Use AI-powered audits and smart filters to win new clients fast.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com',
    siteName: 'WebbedLeads',
    images: [
      {
        url: '/banner.png', // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'WebbedLeads – Find Leads Without Websites',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebbedLeads – Find Businesses Without Websites',
    description:
      'Get high-converting leads and AI insights to help you sell web design and SEO services.',
    images: ['/banner.png'],
    creator: '@WebbedLeads', // Optional: Replace with your Twitter handle
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
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* Google Maps Places API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_API_KEY}&libraries=places`}
          strategy='afterInteractive'
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
