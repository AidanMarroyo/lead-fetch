export type Lead = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  score: number;
  status: 'new' | 'contacted' | 'in progress' | 'closed';
  notes?: string;
  google_place_id?: string;
};
