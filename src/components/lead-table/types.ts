export type Lead = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  google_place_id: string;
  phone?: string | null;
  score: number;
  status: 'new' | 'contacted' | 'in progress' | 'closed';
  created_at: string;
  lat?: number;
  lng?: number;
  assigned_to?: string;
};
