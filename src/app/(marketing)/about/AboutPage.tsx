'use client';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <section className='max-w-5xl mx-auto px-6 py-24'>
      <motion.h1
        className='text-4xl font-bold text-center mb-6'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About WebbedLeads
      </motion.h1>

      <p className='text-muted-foreground text-center max-w-2xl mx-auto mb-16'>
        WebbedLeads was built for the exact people most lead gen tools ignore —
        web designers, developers, and small agencies who don’t have time to
        chase dead-end leads. We believe in automation, clarity, and closing
        faster.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-2xl font-semibold mb-4'>Why We Built It</h2>
          <p className='text-muted-foreground mb-4'>
            After years in the agency and freelance trenches, we realized the
            real bottleneck wasn&apos;t building great websites — it was
            consistently finding qualified leads.
          </p>
          <p className='text-muted-foreground mb-4'>
            Most tools are made for high-volume cold outreach. We needed
            something sharper: a way to scan the web for real businesses with
            real problems — and hand us a pitch.
          </p>
          <p className='text-muted-foreground'>
            That’s where WebbedLeads comes in. It’s the lead tool we always
            wished we had.
          </p>
        </motion.div>

        <motion.div
          className='w-full'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            width={600}
            height={400}
            className='rounded-xl shadow-lg'
          >
            {' '}
            <source src='/compilation.mp4' type='video/mp4' />
          </video>
        </motion.div>
      </div>

      <motion.div
        className='mt-24 border-t pt-12 text-center'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className='text-xl font-semibold mb-2'>Built by Devs, for Devs</h3>
        <p className='text-muted-foreground max-w-xl mx-auto'>
          {' '}
          Our goal is simple: help digital pros spend less time hunting, and
          more time closing.
        </p>
      </motion.div>
    </section>
  );
}
