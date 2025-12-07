import { SalesFramework, DealStage } from './types';

export const APP_NAME = "GAIMvantage: Sales Intel";
export const LOGO_URL = "https://res.cloudinary.com/deubeu16b/image/upload/v1750868607/logo_aqw2pq.png";

export const COLORS = {
  background: "#050505",
  surface: "#0F0F0F",
  panel: "#0A0A0A",
  gold: "#D4AF37",
  goldSoft: "#F4DF90",
  border: "#222222",
  textPrimary: "#F5F5F5",
  textSecondary: "#C4C4C4",
  danger: "#B91C1C",
};

export const SALES_FRAMEWORKS: SalesFramework[] = ["MEDDIC", "SPICED", "BANT", "Challenger", "Sandler"];
export const DEAL_STAGES: DealStage[] = ["Cold Call", "Discovery", "Demo", "Negotiation", "Closing"];

export const MOCK_ANALYSIS_PROMPT_SPEC = `
{
  "app_purpose": "AI Sales Performance & Revenue Intelligence Platform",
  "core_function": "Ingest sales call audio/transcripts, generate coaching dashboard.",
  "inputs": { "audio": "mp3/wav", "framework": "MEDDIC", "stage": "Discovery" },
  "outputs": "JSON analysis including sentiment, coaching matrix, and executive summary."
}
`;
