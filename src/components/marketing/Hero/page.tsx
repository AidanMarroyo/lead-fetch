'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className='w-full px-6 py-20 md:py-32 bg-background text-foreground'>
      <div className='max-w-5xl mx-auto text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight'
        >
          We Crawl. You Close.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'
        >
          WebbedLeads automates lead discovery for freelancers and agencies by
          scanning Google Business listings and delivering conversion-ready
          clients with AI-driven audits and smart scoring.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='mt-8 flex justify-center gap-4'
        >
          <Button>Get Early Access</Button>
          <Button variant='outline'>See How It Works</Button>
        </motion.div>
      </div>
    </section>
  );
}
