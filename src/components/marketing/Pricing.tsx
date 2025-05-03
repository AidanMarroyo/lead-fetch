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
    price: (
      <>
        <span className='line-through text-muted-foreground mr-1'>$98</span>
        $49/mo
      </>
    ),
    description: 'Full access for solo freelancers and devs.',
    features: [
      '35 leads/month',
      'Google Business scanner',
      'AI audit & pitch builder',
      'CRM dashboard + map view',
      'CSV export & filters',
    ],
    cta: 'Upgrade to Pro',
    highlighted: false,
  },
  {
    name: 'Ultimate',
    price: (
      <>
        <span className='line-through text-muted-foreground mr-1'>$138</span>
        $69/mo
      </>
    ),
    description: 'Unlimited access for power users.',
    features: [
      'Unlimited leads',
      'All Pro features',
      'Priority AI audits',
      'Export insights & trends',
      'Faster sync & analysis',
    ],
    cta: 'Go Ultimate',
    highlighted: true,
  },
  {
    name: 'Team',
    price: (
      <>
        <span className='line-through text-muted-foreground mr-1'>$179</span>
        $89/mo
      </>
    ),
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

        {/* Grid of main plans */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
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

        {/* Enterprise plan - standalone row */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='mt-20 max-w-4xl mx-auto border border-border bg-muted rounded-xl p-8 text-left'
        >
          <h3 className='text-xl font-semibold mb-2'>Enterprise</h3>
          <p className='text-3xl font-bold mb-2'>Custom</p>
          <p className='text-muted-foreground mb-4'>
            Custom solutions for large teams or agencies.
          </p>
          <ul className='space-y-2 text-sm mb-6'>
            {[
              'Unlimited leads',
              'Dedicated account support',
              'Custom integrations',
              'API access & onboarding',
            ].map((f) => (
              <li key={f} className='flex items-center gap-2'>
                <CheckCircle2 className='text-primary w-4 h-4' />
                {f}
              </li>
            ))}
          </ul>
          <Button className='w-full'>Contact Sales</Button>
        </motion.div> */}
      </div>
    </section>
  );
}
