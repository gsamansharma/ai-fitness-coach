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