import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact WebbedLeads – We're Here to Help",
  description:
    'Have questions or need support? Contact the WebbedLeads team and we’ll get back to you within 24 hours.',
  keywords: [
    'contact WebbedLeads',
    'customer support',
    'sales inquiry',
    'lead generation help',
    'web agency support',
    'freelancer contact tool',
    'connect with WebbedLeads',
    'B2B lead generation contact',
    'get support for lead software',
    'WebbedLeads help',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbedleads.com'
  ),
  openGraph: {
    title: 'Contact WebbedLeads – Talk to Our Team',
    description:
      'Have questions about our AI lead generation platform? Get in touch with the WebbedLeads team for support, sales inquiries, or partnership opportunities.',
    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/contact` ||
      'https://www.webbedleads.com/contact',
    siteName: 'WebbedLeads',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'WebbedLeads Contact Page Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact WebbedLeads – Get Support or Say Hello',
    description:
      'Need help with WebbedLeads or want to partner with us? Reach out — our team is here to help.',
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
      `${process.env.NEXT_PUBLIC_SITE_URL}/contact` ||
      'https://www.webbedleads.com/contact',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero */}
      <section className=' py-20 px-6 md:px-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Get in Touch</h1>
          <p className='text-lg max-w-xl mx-auto'>
            Have a question, feedback, or partnership inquiry? The WebbedLeads
            team would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className='pb-12 px-6 md:px-12 max-w-3xl mx-auto'>
        <div className='bg-muted rounded-lg p-8 shadow-md space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Send us a message
          </h2>
          <p className='text-muted-foreground text-sm'>
            We aim to respond to all inquiries within 24 hours.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
