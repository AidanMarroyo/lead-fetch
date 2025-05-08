import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero */}
      <section className=' py-20 px-6 md:px-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Get in Touch</h1>
          <p className='text-lg max-w-xl mx-auto'>
            Have a question, feedback, or partnership inquiry? The WebbedLeads
            team would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className='pb-12 px-6 md:px-12 max-w-3xl mx-auto'>
        <div className='bg-muted rounded-lg p-8 shadow-md space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Send us a message
          </h2>
          <p className='text-muted-foreground text-sm'>
            We aim to respond to all inquiries within 24 hours.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
