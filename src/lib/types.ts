export type LeadFilter = {
  name?: string;
  status?: 'all' | 'new' | 'contacted' | 'in progress' | 'closed' | 'archived' | 'not interested';
  minScore?: number;
  maxScore?: number;
  location?: string;
  recentOnly?: boolean;
  websiteStatus?: 'all' | 'no' | 'has';
  category?: string;
  dueOnly?: boolean; 
  assignedTo?: string; 
};
