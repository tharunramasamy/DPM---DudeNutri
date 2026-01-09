
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FoodAnalysis, DietPlan } from "../types";

// Ensure API key is typed for TypeScript
const apiKey = (process.env.API_KEY as string) || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFoodImage = async (base64Image: string, userProfile: UserProfile): Promise<FoodAnalysis> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this food image for a user with the following profile:
  - Age: ${userProfile.age}
  - Weight: ${userProfile.weight}kg
  - Goal: ${userProfile.goal}
  - Medical Conditions: ${userProfile.conditions.join(', ')}
  - Allergies: ${userProfile.allergies.join(', ')}
  - Diet Preference: ${userProfile.dietPreference}

  You are DudeNutri, a high-energy AI nutrition coach. Provide a detailed nutritional breakdown and safety assessment. Be direct, encouraging, and clear.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          macros: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              sugar: { type: Type.NUMBER },
              sodium: { type: Type.NUMBER },
            },
            required: ["calories", "protein", "carbs", "fat", "sugar", "sodium"]
          },
          safetyWarning: { type: Type.STRING },
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          isSafe: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER }
        },
        required: ["name", "macros", "isSafe", "confidence"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateDietPlan = async (userProfile: UserProfile): Promise<DietPlan[]> => {
  const prompt = `Generate a 3-day personalized "Elite Gains" diet plan for:
  ${JSON.stringify(userProfile)}
  Focus on the goal: ${userProfile.goal}. 
  Include reasons for each meal choice in a fun, motivating "DudeNutri" style.`;

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
            day: { type: Type.STRING },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const getNutritionChatResponse = async (history: { role: string, text: string }[], userProfile: UserProfile): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are DudeNutri AI Coach. 
      Use user data: ${JSON.stringify(userProfile)}. 
      Provide educational, non-diagnostic guidance. 
      Stay high-energy, helpful, and Gen-Z friendly. Use emojis like 🥗, 💪, 🚀, 💎.
      Always include a medical disclaimer in the first message of the session.`,
    },
  });

  const lastMessage = history[history.length - 1].text;
  const result = await chat.sendMessage({ message: lastMessage });
  return result.text || "Sorry bro, I lost my train of thought. Try asking again! 💪";
};
