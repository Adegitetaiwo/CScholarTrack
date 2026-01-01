
import { GoogleGenAI, Type } from "@google/genai";

// Ensure API_KEY is used directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestDocumentsForScholarship = async (
  title: string, 
  university: string, 
  degreeLevel: string
) => {
  const prompt = `List the typical required documents for a ${degreeLevel} scholarship titled "${title}" at ${university}. 
  Identify which ones are likely reusable (like Passports, Transcripts) and which are specific (like Statement of Purpose).
  Provide a brief description for each.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              isReusable: { type: Type.BOOLEAN }
            },
            required: ['name', 'description', 'isReusable']
          }
        }
      }
    });

    // Access .text property directly. It is not a method.
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generatePersonalizedTimeline = async (
  applicationDeadline: string,
  documents: any[]
) => {
  const prompt = `Given an application deadline of ${applicationDeadline} and these required documents: ${documents.map(d => d.name).join(', ')}. 
  Suggest an internal deadline for each document to ensure a stress-free submission. Return as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              documentName: { type: Type.STRING },
              suggestedDeadline: { type: Type.STRING, description: "ISO Date string" },
              reason: { type: Type.STRING }
            },
            required: ['documentName', 'suggestedDeadline', 'reason']
          }
        }
      }
    });

    // Access .text property directly. It is not a method.
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Timeline Error:", error);
    return [];
  }
};
