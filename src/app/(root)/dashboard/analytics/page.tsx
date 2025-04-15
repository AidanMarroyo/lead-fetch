import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AnalyticsDashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>📊 Analytics Dashboard</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard title='Leads Discovered' value='124' />
        <StatCard title='Conversion Rate' value='32%' />
        <StatCard title='Top Category' value='Plumber' />
        <StatCard title='Most Active User' value='Neil Sims' />
      </div>

      {/* Trend Chart Placeholder */}
      <div className='bg-white dark:bg-gray-900 p-6 border rounded-lg shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Leads Discovery Trend</h2>
        <div className='h-64 flex items-center justify-center text-muted-foreground text-sm'>
          (Chart coming soon...)
        </div>
      </div>
    </main>
  );
}

// Helper stat card component
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className='bg-muted p-4 rounded-lg shadow-sm border'>
      <p className='text-sm text-muted-foreground'>{title}</p>
      <p className='text-2xl font-bold mt-1'>{value}</p>
    </div>
  );
}
