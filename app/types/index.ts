export type Plan = {
  workoutPlan: {
    day: number;
    dayTitle: string;
    exercises: { name: string; sets?: number; reps?: string; duration?: string; rest?: string }[];
  }[];
  dietPlan: {
    day: number;
    meals: { breakfast: string; lunch: string; dinner: string; snacks: string };
  }[];
  tips: string[];
};

export type UserProfileData = {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory: string;
  stressLevel: string;
};