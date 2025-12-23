import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserPreferences, Itinerary } from "../types";

// Define the schema for structured JSON output
const activitySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    location: { type: Type.STRING },
    estimatedCost: { type: Type.STRING },
    duration: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["title", "description", "location"],
};

const dayPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER },
    theme: { type: Type.STRING },
    morning: { type: Type.ARRAY, items: activitySchema },
    afternoon: { type: Type.ARRAY, items: activitySchema },
    evening: { type: Type.ARRAY, items: activitySchema },
  },
  required: ["dayNumber", "theme", "morning", "afternoon", "evening"],
};

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    days: { type: Type.ARRAY, items: dayPlanSchema },
  },
  required: ["title", "summary", "days"],
};

// Singleton to hold the chat session
let chatSession: Chat | null = null;

export const startNewTripSession = async (prefs: UserPreferences): Promise<Itinerary> => {
  // Initialize the API client inside the function to avoid top-level process access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chatSession = ai.chats.create({
    model: "gemini-3-flash-preview", // Good balance of speed and reasoning for complex JSON
    config: {
      systemInstruction: `You are an expert family travel planner. Your goal is to create detailed, realistic, and structured travel itineraries based on user inputs. 
      Always prioritize family-friendly logistics (not too many activities, breaks included). 
      Format dates based on the user's start date.
      Ensure the output is strictly Valid JSON adhering to the provided schema.`,
      responseMimeType: "application/json",
      responseSchema: itinerarySchema,
    },
  });

  const prompt = `Create a ${prefs.duration}-day trip to ${prefs.destination} starting on ${prefs.startDate}.
  Travelers: ${prefs.travelers}.
  Budget: ${prefs.budget}.
  Walking Tolerance: ${prefs.walking}.
  Interests: ${prefs.interests.join(", ")}.
  
  Please provide a day-by-day itinerary.`;

  try {
    const response = await chatSession.sendMessage({ message: prompt });
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Parse JSON
    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const refineItinerary = async (feedback: string): Promise<Itinerary> => {
  if (!chatSession) {
    throw new Error("No active session. Please create a trip first.");
  }

  const prompt = `Update the itinerary based on this feedback: "${feedback}".
  Keep the same JSON structure. Maintain the same dates and general flow unless requested otherwise.`;

  try {
    const response = await chatSession.sendMessage({ message: prompt });
    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Gemini Refine Error:", error);
    throw error;
  }
};
