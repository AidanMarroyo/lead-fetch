import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const linkClass = 'text-sm hover:text-primary transition-colors';

  return (
    <footer className='border-t border-border bg-background text-muted-foreground'>
      <div className='max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8'>
        {/* Branding */}
        <div>
          <Link href='/dashboard/leads' className='flex items-center'>
            <Image
              className='mr-3 block dark:hidden'
              alt='WebbedLeads logo'
              src='/webbed-logo.png'
              width={120}
              height={120}
            />
            <Image
              className='mr-3 hidden dark:block'
              alt='WebbedLeads dark logo'
              src='/webbed-logo-dark.png'
              width={120}
              height={120}
            />
          </Link>
          <p className='mt-2 text-sm leading-relaxed'>
            We crawl. You close. Built for web pros.
          </p>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col space-y-2'>
          <h3 className='text-md font-semibold tracking-tight'>Quick Links</h3>
          <Link href='/features' className={linkClass}>
            Features
          </Link>
          <Link href='/pricing' className={linkClass}>
            Pricing
          </Link>
          <Link href='/faq' className={linkClass}>
            FAQ
          </Link>
        </div>

        {/* Legal */}
        <div className='flex flex-col space-y-2'>
          <h3 className='text-md font-semibold tracking-tight'>Legal</h3>
          <Link href='/privacy' className={linkClass}>
            Privacy Policy
          </Link>
          <Link href='/terms' className={linkClass}>
            Terms of Service
          </Link>
        </div>

        {/* Support */}
        <div className='flex flex-col space-y-2'>
          <h3 className='text-md font-semibold tracking-tight'>Support</h3>
          <Link href='/contact-us' className={linkClass}>
            Contact Us
          </Link>
          <Link href='/maintenance' className={linkClass}>
            Blog
          </Link>
        </div>

        {/* Copyright */}
        <div className='flex items-end md:items-center justify-start md:justify-end'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} WebbedLeads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
