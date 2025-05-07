'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../../variants';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'Who is WebbedLeads for?',
    answer:
      'WebbedLeads is built for freelance web designers, developers, and digital agencies who want to fill their pipeline with qualified leads.',
  },
  {
    question: 'How does lead scoring work?',
    answer:
      'Our system analyzes Business profiles and websites, assigning a score based on web presence gaps, site quality, profile completeness, and more. Higher scores mean higher potential.',
  },
  {
    question: 'Can I use this for local clients?',
    answer:
      'Yes — WebbedLeads is especially powerful for targeting local businesses who are missing a site or need a modern upgrade. Filter by city, state, or postal code.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'Nope. WebbedLeads is fully cloud-based. Just sign up, log in, and start discovering leads.',
  },
  {
    question: 'What’s included in the free plan?',
    answer:
      'You get 10 qualified leads per month, limited dashboard access, and basic audit features — perfect for testing the platform.',
  },
  {
    question: 'Can I upgrade or cancel anytime?',
    answer:
      'Absolutely. Upgrade, downgrade, or cancel directly from your billing dashboard at any time.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className='bg-muted border-t border-border py-24 px-6'>
      <motion.div
        className='max-w-4xl mx-auto text-center'
        variants={fadeIn('up', 0.2)}
        initial='hidden'
        whileInView='show'
        viewport={{ once: false, amount: 0.8 }}
      >
        <h2 className='text-4xl font-bold mb-6'>Frequently Asked Questions</h2>
        <p className='text-muted-foreground max-w-xl mx-auto mb-12'>
          Still curious? Here are answers to the most common questions from
          freelancers and agencies using WebbedLeads.
        </p>

        <div className='space-y-4 text-left'>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className='border border-border rounded-lg bg-background'
            >
              <button
                onClick={() => toggle(i)}
                className='w-full flex items-center justify-between p-4 text-left'
              >
                <span className='font-medium'>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    className='px-4 pb-4 text-sm text-muted-foreground'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
