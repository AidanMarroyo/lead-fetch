'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  interface Stats {
    totalLeads: number;
    conversionRate: number;
    topCategory: string;
    mostActiveUser: string;
    topConvertingCategory: string;
    averageScoreClosed: number;
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <main className='max-w-6xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>📊 Analytics Dashboard</h1>

      {loading ? (
        <div className='flex justify-center items-center h-40 text-muted-foreground'>
          <Loader2 className='h-6 w-6 animate-spin mr-2' />
          Loading analytics...
        </div>
      ) : stats ? (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
            <StatCard title='Total Leads' value={stats.totalLeads.toString()} />
            <StatCard
              title='Conversion Rate'
              value={`${stats.conversionRate}%`}
            />
            <StatCard title='Top Category' value={stats.topCategory} />
            <StatCard title='Most Active User' value={stats.mostActiveUser} />
            <StatCard
              title='Top Converting Category'
              value={stats.topConvertingCategory}
            />
            <StatCard
              title='Avg. Score of Conversions'
              value={stats.averageScoreClosed.toString()}
            />
          </div>

          <div className='bg-white dark:bg-gray-900 p-6 border rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold mb-4'>
              Leads Discovery Trend
            </h2>
            <div className='h-64 flex items-center justify-center text-muted-foreground text-sm'>
              (Chart coming soon...)
            </div>
          </div>
        </>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No analytics available yet.
        </p>
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className='bg-muted p-4 rounded-lg shadow-sm border'>
      <p className='text-sm text-muted-foreground'>{title}</p>
      <p className='text-2xl font-bold mt-1 truncate'>{value}</p>
    </div>
  );
}
