import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Schema definition for the expected JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          text: { type: Type.STRING },
        },
      },
    },
    sentiment_graph_data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          sentiment_score: { type: Type.NUMBER },
          engagement_score: { type: Type.NUMBER },
        },
      },
    },
    performance_metrics: {
      type: Type.OBJECT,
      properties: {
        overall_score: { type: Type.NUMBER },
        deal_risk_level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
        talk_ratio_rep: { type: Type.NUMBER },
        talk_ratio_customer: { type: Type.NUMBER },
        interruption_count: { type: Type.NUMBER },
        avg_question_depth: { type: Type.NUMBER },
        monologue_fatigue_segments: { type: Type.NUMBER },
        deal_momentum_score: { type: Type.NUMBER },
        coachability_score: { type: Type.NUMBER },
      },
    },
    high_value_moments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
      },
    },
    coaching_matrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill_area: { type: Type.STRING },
          score: { type: Type.NUMBER },
          evidence_quote: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          advice: { type: Type.STRING },
        },
      },
    },
    coaching_card: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        missed_opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        action_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
  required: [
    "transcript",
    "sentiment_graph_data",
    "performance_metrics",
    "high_value_moments",
    "coaching_matrix",
    "coaching_card",
  ],
};

export const analyzeAudio = async (
  apiKey: string,
  audioBase64: string,
  mimeType: string,
  framework: string,
  stage: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey });

  // Using gemini-2.5-flash for audio transcription as requested, 
  // but since we need complex reasoning on top of it, 
  // we can use 2.5-flash for the whole pipeline or 3-pro if available.
  // The prompt implies "transcribe and analyze".
  // For speed and specific "transcribe" feature request, we use 2.5-flash.
  
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    You are an expert Sales Revenue Intelligence Coach.
    
    Task:
    1. Transcribe the provided audio file accurately with speaker diarization (Sales Rep vs Customer).
    2. Analyze the conversation based on the '${framework}' framework and the Deal Stage: '${stage}'.
    3. Generate a structured analysis in strict JSON format.

    Processing Rules:
    - If the audio is silence or not a conversation, return empty structures but do not fail.
    - Identify "Sales Rep" (the one asking questions/selling) and "Customer".
    - Calculate sentiment over time (-1 to 1).
    - Provide specific coaching advice based on timestamps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for factual transcription and rigorous scoring
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
