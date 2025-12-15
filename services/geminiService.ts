import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiResponse } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    result: {
      type: Type.STRING,
      description: "The numerical or algebraic result of the calculation.",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise, step-by-step explanation of how the result was derived.",
    },
  },
  required: ["result", "explanation"],
};

export const solveMathWithGemini = async (input: string): Promise<AiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Solve this math problem or calculate this expression. 
      If it is a general question not related to math or logic, politely decline but try to answer if it involves numbers.
      Input: "${input}"
      Provide the result and a brief explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful mathematical assistant. You provide clear, accurate numerical answers and brief logical explanations. Always format the output as JSON."
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AiResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      result: "Error",
      explanation: "I couldn't process that request right now. Please check your network or try a simpler query."
    };
  }
};
