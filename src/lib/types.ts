export type LeadFilter = {
  status?: 'new' | 'contacted' | 'in progress' | 'closed';
  minScore?: number;
  maxScore?: number;
  location?: string;
};
