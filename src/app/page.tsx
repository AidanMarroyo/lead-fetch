import FAQ from '@/components/marketing/FAQ';
import Features from '@/components/marketing/Features';
import Footer from '@/components/marketing/Footer';
import Hero from '@/components/marketing/Hero';

import LivePreview from '@/components/marketing/LivePreview';
import Navbar from '@/components/marketing/Navbar';
import Pricing from '@/components/marketing/Pricing';

export default function MarketingHomePage() {
  return (
    <div className='bg-background text-foreground'>
      {/* <Navbar /> */}
      <main>
        <Hero />
        <Features />
        <LivePreview />
        {/* <Testimonials /> */}
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
