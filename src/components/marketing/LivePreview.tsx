'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../variants';

export default function LivePreview() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className='bg-muted py-20 px-6 border-t border-border'>
      <div className='max-w-6xl mx-auto text-center'>
        <motion.h2
          variants={fadeIn('left', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='text-3xl md:text-4xl font-bold mb-6'
        >
          See WebbedLeads in Action
        </motion.h2>
        <motion.p
          variants={fadeIn('right', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='text-muted-foreground mb-12 max-w-2xl mx-auto'
        >
          Instantly find, qualify, and organize high-potential leads with our
          built-in Google Business scanner, AI audit engine, and CRM-style
          pipeline.
        </motion.p>

        <motion.div
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.8 }}
          className='overflow-hidden rounded-2xl border shadow-xl'
        >
          <Image
            src={isDark ? '/crm-dark.png' : '/crm-light.png'}
            alt='WebbedLeads Dashboard Preview'
            width={1200}
            height={700}
            className='w-full h-auto'
            priority
          />
        </motion.div>

        <p className='text-sm text-muted-foreground mt-4'>
          Dark and light mode supported for modern workspaces.
        </p>
      </div>
    </section>
  );
}
