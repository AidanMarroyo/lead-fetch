import { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About WebbedLeads - The Lead Machine for Web Professionals',
  description:
    'Learn how WebbedLeads helps freelancers and agencies grow with intelligent lead sourcing, website audits, and Google Profile insights.',
  keywords: [
    'lead generation software',
    'web design clients',
    'SEO prospecting tools',
    'AI lead scoring',
    'web agency growth',
    'Google business outreach',
    'freelancer client acquisition',
    'website audits for agencies',
    'find businesses without websites',
    'AI-powered sales tools',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com'
  ),
  openGraph: {
    title: 'About WebbedLeads – Built for Web Agencies & Freelancers',
    description:
      'WebbedLeads is on a mission to help freelancers and agencies find better leads. We use AI to uncover local businesses without websites and deliver actionable insights to help you convert them.',
    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/about` ||
      'https://www.webbedleads.com/about',
    siteName: 'WebbedLeads',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'WebbedLeads – About the Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WebbedLeads – For Agencies & Freelancers',
    description:
      'Learn how WebbedLeads helps you identify businesses that need your web services. AI scoring, filters, and built-in audits built for growth.',
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
      `${process.env.NEXT_PUBLIC_SITE_URL}/about` ||
      'https://www.webbedleads.com/about',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}
