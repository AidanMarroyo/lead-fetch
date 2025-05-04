import FAQ from '@/components/marketing/FAQ';
import Features from '@/components/marketing/Features';
import Hero from '@/components/marketing/Hero';

import LivePreview from '@/components/marketing/LivePreview';
import Pricing from '@/components/marketing/Pricing';

export default function MarketingHomePage() {
  return (
    <div className='bg-background text-foreground'>
      <main>
        <Hero />
        <Features />
        <LivePreview />
        {/* <Testimonials /> */}
        <Pricing />
        <FAQ />
      </main>
    </div>
  );
}
