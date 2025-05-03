import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='border-t border-border bg-background text-muted-foreground'>
      <div className='max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Branding */}
        <div>
          <h2 className='text-lg font-semibold text-foreground'>WebbedLeads</h2>
          <p className='mt-2 text-sm'>
            We crawl. You close. Built for web pros.
          </p>
        </div>

        {/* Links */}
        <div className='flex flex-col space-y-2'>
          <Link
            href='#features'
            className='text-sm hover:text-primary transition'
          >
            Features
          </Link>
          <Link
            href='#pricing'
            className='text-sm hover:text-primary transition'
          >
            Pricing
          </Link>
          <Link href='#faq' className='text-sm hover:text-primary transition'>
            FAQ
          </Link>
          <Link href='/app' className='text-sm hover:text-primary transition'>
            Launch App
          </Link>
        </div>

        {/* Copyright */}
        <div className='flex items-end md:items-center justify-start md:justify-end'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} WebbedLeads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
