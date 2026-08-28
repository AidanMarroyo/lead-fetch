export type Lead = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  score: number;
  status: 'new' | 'contacted' | 'in progress' | 'closed' | 'archived'| 'not interested';
  notes?: string;
  google_place_id?: string;
  rating?: number;
  website?: string;
  tech_stack?: string[];
  traffic_rank?: number;
  ad_spend_estimate?: string;
  optimization_level?: 'basic' | 'intermediate' | 'advanced';
  website_score?: number;
  sales_points?: string;
  auto_pitch?: string;
  website_grade?: 'bad' | 'average' | 'good';
  contact_attempts: number;
  last_contacted_at?: string
  next_follow_up_date?: Date
  reviews?: string[];
};
