'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../variants';

export default function Hero() {
  return (
    <section className='w-full px-6 py-20 md:py-32 bg-background text-foreground'>
      <div className='max-w-5xl mx-auto text-center'>
        <motion.h1
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight'
        >
          We Crawl. You Close.
        </motion.h1>

        <motion.p
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'
        >
          WebbedLeads automates lead discovery for freelancers and agencies by
          scanning Google Business listings and delivering conversion-ready
          clients with AI-driven audits and smart scoring.
        </motion.p>

        <motion.div
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='mt-8 flex justify-center gap-4'
        >
          <Button>Get Early Access</Button>
          <Button variant='outline'>See How It Works</Button>
        </motion.div>
      </div>
    </section>
  );
}
