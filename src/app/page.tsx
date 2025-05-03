import FAQ from '@/components/marketing/FAQ/page';
import Features from '@/components/marketing/Features/page';
import Footer from '@/components/marketing/Footer/page';
import Hero from '@/components/marketing/Hero/page';

import LivePreview from '@/components/marketing/LivePreview';
import Navbar from '@/components/marketing/Navbar/page';
import Pricing from '@/components/marketing/Pricing/page';

export default function MarketingHomePage() {
  return (
    <div className='bg-background text-foreground'>
      <Navbar />
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
