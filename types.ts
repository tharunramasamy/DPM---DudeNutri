
export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'diabetes-control' | 'heart-health';
  conditions: string[];
  allergies: string[];
  dietPreference: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  dailyCalorieTarget: number;
}

export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
}

export interface FoodAnalysis {
  name: string;
  macros: MacroData;
  safetyWarning: string | null;
  alternatives: string[];
  isSafe: boolean;
  confidence: number;
}

export interface MealLog {
  id: string;
  timestamp: number;
  foodName: string;
  macros: MacroData;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DietPlan {
  day: string;
  meals: {
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    name: string;
    calories: number;
    reason: string;
  }[];
}
