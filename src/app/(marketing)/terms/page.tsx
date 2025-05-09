import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – WebbedLeads',
  description:
    'Read the full WebbedLeads terms and conditions for using our SaaS platform.',
};

export default function TermsPage() {
  return (
    <main className='max-w-4xl mx-auto px-6 py-20'>
      <h1 className='text-4xl font-bold mb-6'>Terms of Service</h1>
      <p className='text-muted-foreground mb-6'>Effective Date: May 3, 2025</p>

      <div className='space-y-6 text-sm leading-6 text-muted-foreground'>
        <p>
          These Terms of Service (“Terms”) govern your use of the WebbedLeads
          platform (“Service”, “we”, “us”, or “our”), accessible via{' '}
          <span className='text-primary hover:cursor-pointer'>
            https://webbedleads.com
          </span>{' '}
          . By creating an account or using any part of our Service, you agree
          to these Terms. If you do not agree, do not use the Service.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>1. Use of the Service</h2>
        <p>
          You must be at least 18 years old and legally capable of entering a
          contract. You are responsible for all activity under your account and
          agree not to share login credentials with others outside your
          authorized team (if applicable).
        </p>
        <p>You agree not to use WebbedLeads:</p>
        <ul className='pl-4 list-disc list-inside space-y-1'>
          <li>For illegal or fraudulent purposes</li>
          <li>To resell leads or data unless explicitly permitted</li>
          <li>To overload or interfere with the platform&apos;s operation</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate your account if we detect
          misuse.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>2. Account Registration</h2>
        <p>
          To use our Service, you must provide accurate and complete
          information. You are responsible for maintaining the security of your
          account credentials. If you suspect unauthorized access, notify us
          immediately at{' '}
          <span className='text-primary'> support@webbedleads.com</span>.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>3. Subscriptions & Payments</h2>
        <p>
          Paid plans are billed via Stripe on a monthly basis. By subscribing,
          you authorize recurring billing. Prices are displayed in USD.
        </p>
        <p>
          You may cancel your subscription at any time, and your access will
          continue until the end of your billing period. No refunds are issued
          for partial months or unused features.
        </p>
        <p>
          We reserve the right to change prices or plans with at least 14 days
          notice.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>4. Lead Data & AI Analysis</h2>
        <p>WebbedLeads uses:</p>

        <ul className='pl-4 list-disc list-inside space-y-1'>
          <li>
            <strong> Google Places API</strong> to retrieve business listings
          </li>
          <li>
            <strong> OpenAI</strong> to generate audit suggestions
          </li>
          <li>
            <strong> Puppeteer</strong> to analyze websites
          </li>
          <li>
            <strong> BuiltWith</strong> for tech and performance data
          </li>
        </ul>
        <p>
          You agree not to abuse or extract this data in bulk, nor bypass rate
          limits or platform restrictions. WebbedLeads is not responsible for
          inaccuracies in third-party data sources.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>5. Email Communication</h2>
        <p>
          By creating an account on WebbedLeads, you agree to receive
          transactional and administrative emails (e.g., billing notices,
          service updates, system alerts) as well as marketing communications.
        </p>
        <p>
          Marketing emails will be sent and may include newsletters, feature
          announcements, and promotions. You may unsubscribe from marketing
          emails at any time using the link provided in each message, though
          transactional communications are required for your continued use of
          the service.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>6. Intellectual Property</h2>
        <p>
          WebbedLeads, its design, software, and features are protected by
          intellectual property laws. You may not copy, reverse engineer, or use
          any part of our Service outside its intended purpose.
        </p>
        <p>
          All lead data generated or scored through the platform is licensed for
          your personal or business use, but not for resale unless explicitly
          authorized.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>7. Termination</h2>
        <p>
          We may suspend or terminate your account at our discretion if you
          violate these Terms. You may cancel at any time via your account
          dashboard or by emailing us.
        </p>
        <p>
          Upon termination, your access will be revoked and your stored data may
          be deleted after 30 days.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>
          8. Disclaimer & Limitation of Liability
        </h2>
        <p>
          The Service is provided “as is” without warranties of any kind. We do
          not guarantee lead quality, accuracy, or your success in closing
          deals.
        </p>
        <p>
          To the fullest extent permitted by law, WebbedLeads shall not be
          liable for any indirect, incidental, or consequential damages
          resulting from your use of the Service.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Ontario, Canada. Any disputes
          shall be resolved in the courts located in Hamilton, Ontario.
        </p>

        <Separator className='my-4' />

        <h2 className='text-lg font-semibold'>10. Updates to These Terms</h2>
        <p>
          We may update these Terms occasionally. We will notify users via email
          or in-app alerts of significant changes. Continued use of the Service
          constitutes your acceptance of the revised Terms.
        </p>

        <Separator className='my-4' />
        <h2 className='text-lg font-semibold'>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at:
          <br /> Email:{' '}
          <span className='text-primary'> privacy@webbedleads.com</span>
        </p>
      </div>
    </main>
  );
}
