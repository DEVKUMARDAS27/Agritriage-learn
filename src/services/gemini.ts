import { GoogleGenAI, Type } from "@google/genai";
import { AGRI_KNOWLEDGE_BASE } from "../constants/agriData";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const generateQuiz = async (topic: string, difficulty: string): Promise<QuizQuestion[]> => {
  const prompt = `Generate 5 multiple-choice questions about "${topic}" at a "${difficulty}" level for farmers and agriculture students.
  Use the following knowledge base for context if possible:
  ${AGRI_KNOWLEDGE_BASE}
  
  Each question should have 4 options and a clear explanation.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of 4 options"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "Index of the correct option (0-3)"
            },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};

export const getTriageResponse = async (query: string, agentType: "CROP" | "DISEASE" | "POLICY") => {
  const systemInstructions = {
    CROP: "You are a Crop Advisor Agent. Focus on soil, weather, and seasonal data to recommend crops, fertilizers, and irrigation.",
    DISEASE: "You are a Disease Expert Agent. Focus on diagnosing plant diseases from symptoms and suggesting treatments.",
    POLICY: "You are a Policy Advisor Agent. Focus on government schemes, benefits, and financial aid for farmers."
  };

  const prompt = `User Query: ${query}
  
  Context from Knowledge Base:
  ${AGRI_KNOWLEDGE_BASE}
  
  Provide actionable, professional advice grounded in agricultural science. 
  Include a brief 'Next Steps' section with 2-3 bullet points.
  Also, recommend 2-3 keywords that could be used to search for visual reference images related to your advice.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstructions[agentType]
    }
  });

  return response.text || "I'm sorry, I couldn't process your request. Please try again.";
};

export const evaluatePerformance = async (topic: string, results: { question: string, isCorrect: boolean, userAnswer: string, correctAnswer: string }[]) => {
  const prompt = `Analyze the student's performance in a quiz on "${topic}".
  Results:
  ${JSON.stringify(results, null, 2)}
  
  Provide a professional evaluation including:
  1. Overall summary of strengths and weaknesses.
  2. Specific advice for improvements.
  3. Recommended areas for further study.
  
  Format the output in clean Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "No evaluation available.";
};

export const getCropDetails = async (crop: string) => {
  const prompt = `Provide a detailed agricultural guide for the crop: "${crop}".
  Include:
  1. Botanical Name & Family
  2. Optimal Soil Type & pH
  3. Climate & Temperature Requirements
  4. Best Planting Season
  5. Critical Growth Stages
  6. Common Pests & Management
  
  Format the response in professional Markdown with clear headings and bullet points.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Information currently unavailable for this crop.";
};
