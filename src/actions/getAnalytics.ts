'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function getAnalyticsData() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const teamId = membership?.team_id;
  const filterKey = teamId ? 'team_id' : 'user_id';
  const filterValue = teamId || user.id;

  // All leads
  const { data: leads } = await supabase
    .from('leads')
    .select('category, status, score')
    .eq(filterKey, filterValue);

  if (!leads || leads.length === 0) {
    return {
      totalLeads: 0,
      conversionRate: 0,
      topCategory: 'N/A',
      mostActiveUser: 'N/A',
      topConvertingCategory: 'N/A',
      averageScoreClosed: 0,
    };
  }

  // Conversion rate
  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === 'closed');
  const conversionRate = Math.round((closedLeads.length / totalLeads) * 100);

  // Top category (by volume)
  const categoryCounts = leads.reduce((acc, lead) => {
    const cat = lead.category ?? 'Unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Top converting category
  const conversionByCategory: Record<
    string,
    { total: number; closed: number }
  > = {};
  leads.forEach((l) => {
    const cat = l.category ?? 'Unknown';
    if (!conversionByCategory[cat]) {
      conversionByCategory[cat] = { total: 0, closed: 0 };
    }
    conversionByCategory[cat].total++;
    if (l.status === 'closed') conversionByCategory[cat].closed++;
  });
  const topConvertingCategory = Object.entries(conversionByCategory)
    .map(([cat, data]) => ({
      category: cat,
      rate: data.total ? data.closed / data.total : 0,
    }))
    .sort((a, b) => b.rate - a.rate)[0]?.category ?? 'N/A';

  const closedScores = closedLeads.map((l) => l.score ?? 0);
  const averageScoreClosed =
    closedScores.length > 0
      ? Math.round(
          (closedScores.reduce((sum, s) => sum + s, 0) / closedScores.length) *
            100
        ) / 100
      : 0;

  // Most active user logic stays unchanged
  const { data: activity } = await supabase
    .from('activity_logs')
    .select('user_id')
    .eq(filterKey, filterValue);

  const userCounts: Record<string, number> = {};
  for (const row of activity ?? []) {
    if (row.user_id) {
      userCounts[row.user_id] = (userCounts[row.user_id] || 0) + 1;
    }
  }

  const topUserId = Object.entries(userCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  let mostActiveUser = 'N/A';

  if (topUserId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', topUserId)
      .single();

    if (profile) {
      mostActiveUser =
        profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : profile.email ?? 'Unknown';
    }
  }

  return {
    totalLeads,
    conversionRate,
    topCategory,
    mostActiveUser,
    topConvertingCategory,
    averageScoreClosed,
  };
}
