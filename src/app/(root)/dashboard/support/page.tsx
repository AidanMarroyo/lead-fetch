import ContactForm from '@/components/ContactForm';
import { getCurrentUser } from '@/lib/auth';

export default async function SupportPage() {
  const user = await getCurrentUser();
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero Section */}
      <section className='py-20 px-6 md:px-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Support</h1>
          <p className='text-lg max-w-xl mx-auto'>
            Need help with your account, have technical issues, or general
            questions? We&apos;re here to assist you.
          </p>
        </div>
      </section>

      {/* Support Form Section */}
      <section className='pb-12 px-6 md:px-12 max-w-3xl mx-auto'>
        <div className='bg-muted rounded-lg p-8 shadow-md space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Submit a Support Request
          </h2>
          <p className='text-muted-foreground text-sm'>
            Our support team typically replies within 24 hours.
          </p>
          <ContactForm userId={user?.id} />
        </div>
      </section>
    </div>
  );
}
