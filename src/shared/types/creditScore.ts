export interface CreditScore {
  score: number;
  scoreRange: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  lastUpdated: string;
  provider: 'FICO' | 'VantageScore';
  factors: CreditFactor[];
  history: ScoreHistoryPoint[];
}

export interface CreditFactor {
  factor: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Positive' | 'Negative' | 'Neutral';
  description: string;
  percentage: number;
}

export interface ScoreHistoryPoint {
  date: string;
  score: number;
  change: number;
}

export interface CreditTip {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  timeframe: string;
  category: 'Payment' | 'Utilization' | 'Length' | 'Mix' | 'Inquiries';
}
