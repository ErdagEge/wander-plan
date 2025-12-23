export enum BudgetLevel {
  Budget = "Budget-friendly",
  Moderate = "Moderate",
  Luxury = "Luxury",
}

export enum WalkingTolerance {
  Low = "Low (prefer taxi/transit)",
  Medium = "Medium (happy to walk)",
  High = "High (hiking/long walks)",
}

export interface UserPreferences {
  destination: string;
  startDate: string;
  duration: number;
  budget: BudgetLevel;
  walking: WalkingTolerance;
  interests: string[];
  travelers: string; // e.g., "2 adults, 2 kids (ages 5 and 8)"
}

export interface Activity {
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
  duration: string;
  tags: string[];
}

export interface DayPlan {
  dayNumber: number;
  date: string; // generated relative to start date
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

export interface Itinerary {
  title: string;
  summary: string;
  days: DayPlan[];
}

export interface ChatState {
  isLoading: boolean;
  error: string | null;
  itinerary: Itinerary | null;
}
