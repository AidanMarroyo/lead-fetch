export type LeadFilter = {
  status?: 'all' | 'new' | 'contacted' | 'in progress' | 'closed';
  minScore?: number;
  maxScore?: number;
  location?: string;
  recentOnly?: boolean;
  websiteStatus?: 'all' | 'no' | 'has';
};
