'use client';;
import { useEffect, useState } from 'react';

export function useTeamAdmin() {
  const [admin, setAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamAdmin() {
      const res = await fetch('/api/team/admin');
      const data = await res.json();
        if (data.role === 'admin') {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
    
      setLoading(false);
    }
  
    fetchTeamAdmin();
  }, []);

  return { admin, loading };
}
