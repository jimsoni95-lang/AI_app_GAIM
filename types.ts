export interface TranscriptTurn {
  speaker: string;
  timestamp: string;
  text: string;
}

export interface SentimentPoint {
  time: string; // e.g., "00:30" or seconds as string
  sentiment_score: number; // -1 to 1
  engagement_score: number; // 0 to 100
}

export interface PerformanceMetrics {
  overall_score: number;
  deal_risk_level: 'Low' | 'Medium' | 'High';
  talk_ratio_rep: number;
  talk_ratio_customer: number;
  interruption_count: number;
  avg_question_depth: number;
  monologue_fatigue_segments: number;
  deal_momentum_score: number;
  coachability_score: number;
}

export interface HighValueMoment {
  timestamp: string;
  summary: string;
}

export interface CoachingMatrixItem {
  skill_area: string;
  score: number;
  evidence_quote: string;
  timestamp: string;
  advice: string;
}

export interface CoachingCardData {
  strengths: string[];
  missed_opportunities: string[];
  action_steps: string[];
}

export interface AnalysisResult {
  transcript: TranscriptTurn[];
  sentiment_graph_data: SentimentPoint[];
  performance_metrics: PerformanceMetrics;
  high_value_moments: HighValueMoment[];
  coaching_matrix: CoachingMatrixItem[];
  coaching_card: CoachingCardData;
}

export type SalesFramework = 'MEDDIC' | 'SPICED' | 'BANT' | 'Challenger' | 'Sandler';
export type DealStage = 'Discovery' | 'Demo' | 'Negotiation' | 'Closing' | 'Cold Call';
