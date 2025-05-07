'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Smart Lead Scoring',
    description:
      'Automatically prioritize businesses that are most likely to need a website upgrade. Our scoring system analyzes profile completeness, presence of a website, reviews, and more.',
    imgAlt: 'Lead scoring example in dashboard',
    mediaType: 'video', // use 'video' if you want to show a short screen recording instead
    mediaSrc: '/scoring.mp4',
  },
  {
    title: 'Business Scanner',
    description:
      'Find businesses with missing websites, poor descriptions, or unclaimed Google listings. Instantly preview their profile data and location.',
    imgAlt: 'Business search in action',
    mediaType: 'video',
    mediaSrc: '/google-fetch.mp4',
  },
  {
    title: 'AI-Powered Website Audits',
    description:
      'Run audits using Puppeteer and GPT-4 to generate actionable, client-facing website improvement suggestions. Delivered with clarity, no fluff.',
    imgAlt: 'Website audit tool interface',
    mediaType: 'video',
    mediaSrc: '/website-audit.mp4',
  },
  {
    title: 'Pipeline Management',
    description:
      'Organize, tag, and follow up with leads using a clean, drag-and-drop CRM interface. Add notes, assign status, and track all interactions.',
    imgAlt: 'CRM pipeline with lead statuses',
    mediaType: 'video',
    mediaSrc: '/pipeline.mp4',
  },
  {
    title: 'Team Collaboration (Team Plan)',
    description:
      'Invite team members, share notes, and track activity history on every lead. Perfect for small agencies with multiple stakeholders.',
    imgAlt: 'Team member notes and log',
    mediaType: 'video',
    mediaSrc: '/notes.mp4',
  },
];

export default function FeaturesPage() {
  return (
    <div className='max-w-6xl mx-auto px-6 py-24'>
      <motion.h1
        className='text-4xl font-bold text-center mb-6'
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Built to Fill Your Pipeline
      </motion.h1>
      <p className='text-muted-foreground text-center max-w-xl mx-auto mb-16'>
        From solo devs to growing teams, WebbedLeads gives you the automation,
        data, and tools to win more clients.
      </p>

      <div className='space-y-24'>
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className={`flex flex-col md:flex-row ${
              i % 2 === 1 ? 'md:flex-row-reverse' : ''
            } items-center gap-10`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className='md:w-1/2'>
              <h2 className='text-2xl font-semibold mb-3'>{feature.title}</h2>
              <p className='text-muted-foreground mb-4'>
                {feature.description}
              </p>
            </div>
            <div className='md:w-1/2 rounded-lg border overflow-hidden shadow-sm'>
              {feature.mediaType === 'image' ? (
                <Image
                  src={feature.mediaSrc}
                  alt={feature.imgAlt}
                  width={800}
                  height={500}
                  className='rounded-lg w-full h-auto'
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className='w-full rounded-lg'
                >
                  <source src={feature.mediaSrc} type='video/mp4' />
                </video>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className='text-center mt-24'>
        <Link href='/#pricing'>
          <Button>Get Started Free</Button>
        </Link>
      </div>
    </div>
  );
}
