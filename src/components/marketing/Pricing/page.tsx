'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with 3 leads/month and core tools.',
    features: [
      '3 leads/month',
      'Limited dashboard access',
      'Basic audit reports',
      '1 location filter',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49/mo',
    description: 'Full access for solo freelancers and devs.',
    features: [
      '35 leads/month',
      'Google Business scanner',
      'AI audit & pitch builder',
      'CRM dashboard + map view',
      'CSV export & filters',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$179/mo',
    description: 'All features plus team collaboration tools.',
    features: [
      'Unlimited leads',
      'Everything in Pro',
      'Team access (up to 5 users)',
      'Shared pipelines & notes',
      'Activity tracking',
    ],
    cta: 'Scale with Team Plan',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className='bg-background border-t border-border py-24 px-6'>
      <div className='max-w-6xl mx-auto text-center'>
        <motion.h2
          className='text-4xl font-bold mb-6'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Simple Pricing, Serious Results
        </motion.h2>
        <p className='text-muted-foreground max-w-2xl mx-auto mb-16'>
          Whether you’re freelancing or managing a team, WebbedLeads helps you
          fill your pipeline with qualified clients — no fluff, just results.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl border ${
                plan.highlighted
                  ? 'border-primary bg-muted shadow-xl'
                  : 'border-border'
              } p-6 text-left`}
            >
              <h3 className='text-xl font-semibold mb-2'>{plan.name}</h3>
              <p className='text-3xl font-bold mb-2'>{plan.price}</p>
              <p className='text-muted-foreground mb-4'>{plan.description}</p>

              <ul className='space-y-2 text-sm mb-6'>
                {plan.features.map((f) => (
                  <li key={f} className='flex items-center gap-2'>
                    <CheckCircle2 className='text-primary w-4 h-4' />
                    {f}
                  </li>
                ))}
              </ul>

              <Button className='w-full'>{plan.cta}</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
