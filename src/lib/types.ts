export type LeadFilter = {
  status?: 'all' | 'new' | 'contacted' | 'in progress' | 'closed' | 'archived' | 'not interested';
  minScore?: number;
  maxScore?: number;
  location?: string;
  recentOnly?: boolean;
  websiteStatus?: 'all' | 'no' | 'has';
};
