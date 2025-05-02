'use client';

import { useEffect, useState } from 'react';

export function useTeamAdmin() {
  const [adminId, setAdminId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamAdmin() {
      const res = await fetch('/api/team/admin');
      const data = await res.json();
      setAdminId(data.ownderId || '');
      setLoading(false);
    }
    fetchTeamAdmin();
  }, []);

  return { adminId, loading };
}
