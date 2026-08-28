'use client';

import { useEffect, useState } from 'react';

export function useUserPlan() {
  const [plan, setPlan] = useState<'free' | 'pro' | 'unlimited' | 'team' | 'trial'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      const res = await fetch('/api/user/plan');
      const data = await res.json();
      setPlan(data.plan || 'free');
      setLoading(false);
    }
    fetchPlan();
  }, []);

  return { plan, loading, setLoading };
}
