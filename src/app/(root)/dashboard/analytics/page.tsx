import { getAnalyticsData } from '@/actions/getAnalytics';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLeadTrends } from '@/actions/getLeadTrends';
import { LeadTrendChart } from '@/components/chart/LeadTrendChart';
export default async function AnalyticsDashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');

  const analytics = await getAnalyticsData();

  const {
    totalLeads,
    conversionRate,
    topCategory,
    mostActiveUser,
    topConvertingCategory,
    averageScoreClosed,
  } = analytics || {};

  const trends = await getLeadTrends();
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>📊 Analytics Dashboard</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Leads Discovered'
          value={totalLeads?.toString() || '0'}
        />
        <StatCard title='Conversion Rate' value={`${conversionRate}%`} />
        <StatCard title='Top Category' value={topCategory || 'N/A'} />
        <StatCard title='Most Active User' value={mostActiveUser || 'N/A'} />
        <StatCard
          title='Top Converting Category'
          value={topConvertingCategory || 'N/A'}
        />
        <StatCard
          title='Avg. Score of Conversions'
          value={averageScoreClosed?.toString() || 'N/A'}
        />
      </div>

      {/* Trend Chart Placeholder */}
      <div className='bg-card p-6 border rounded-lg shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Leads Discovery Trend</h2>
        <LeadTrendChart
          data={trends.map(({ week, count }) => ({ date: week, count }))}
        />
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
