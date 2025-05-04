'use client';

import { Brain, Globe, ScanLine, BarChart3, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../variants';

const features = [
  {
    icon: Brain,
    title: 'Smart Lead Scoring',
    description:
      'Automatically ranks leads based on web presence gaps, review activity, and profile completeness — so you focus only on high-opportunity clients.',
  },
  {
    icon: ScanLine,
    title: 'AI-Powered Website Audits',
    description:
      'Audit any website using Puppeteer, Lighthouse, and GPT-4 to instantly uncover UX, SEO, and conversion issues — plus a pitch-ready AI summary.',
  },
  {
    icon: Globe,
    title: 'Google Business Scanner',
    description:
      'Find local businesses with no website or outdated digital presence. Scan millions of profiles and filter by location, type, or quality.',
  },
  {
    icon: BarChart3,
    title: 'Lead Management Dashboard',
    description:
      'Organize, filter, and move leads through a CRM-style pipeline. Add notes, track follow-ups, and assign statuses with ease.',
  },
  {
    icon: Users,
    title: 'Built for Freelancers & Agencies',
    description:
      'Whether you’re solo or scaling, WebbedLeads helps you fill your pipeline without hiring or cold-calling.',
  },
  {
    icon: Zap,
    title: 'Pitch-Ready Profiles, No Guesswork',
    description:
      'Every lead comes with contact info, audit insights, and a personalized pitch — so you can send smarter outreach faster.',
  },
];

export default function Features() {
  return (
    <section className='bg-card py-20 px-6 border-t border-border'>
      <div className='max-w-6xl mx-auto'>
        <motion.h2
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{ once: false, amount: 0.8 }}
          className='text-3xl md:text-4xl font-bold text-center mb-12'
        >
          Everything You Need to Fill Your Pipeline
        </motion.h2>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={fadeIn('up', 0.2)}
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.8 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className='bg-background p-6 rounded-2xl border shadow-sm'
            >
              <feature.icon className='w-8 h-8 text-primary mb-4' />
              <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
