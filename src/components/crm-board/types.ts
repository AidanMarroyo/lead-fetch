export type Lead = {
  id: string;
  name: string;
  address: string;
  score: number;
  status: 'new' | 'contacted' | 'in progress' | 'closed';
};
