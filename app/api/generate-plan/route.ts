import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabaseServer';
import { nanoid } from 'nanoid';
import { UserProfileData } from '@/app/types';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const planSchema = z.object({
  workoutPlan: z.array(z.object({
    day: z.number(),
    dayTitle: z.string(),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.number().optional(),
      reps: z.string().optional(),
      duration: z.string().optional(),
      intensity: z.string().optional(),
      rest: z.string().optional(),
    })),
  })),
  dietPlan: z.array(z.object({
    day: z.number(),
    meals: z.object({
      breakfast: z.string(),
      lunch: z.string(),
      dinner: z.string(),
      snacks: z.string().optional(),
    }),
  })),
  tips: z.array(z.string()),
});


export async function POST(request: Request) {
  try {
    const body: UserProfileData = await request.json();
    console.log('API Route Received Data:', body);

    const prompt = buildPrompt(body);

    const { object: aiPlan } = await generateObject({
      model: groq('openai/gpt-oss-120b'), 
      schema: planSchema, 
      prompt: prompt,
    });
    
    console.log('GroQ Plan Generated:', aiPlan);

    const planId = nanoid(10);
    const { error: supabaseError } = await supabaseServer
      .from('plans')
      .insert({
        id: planId,
        user_inputs: body,
        generated_plan: aiPlan,
      });

    if (supabaseError) {
      console.error('Supabase Error:', supabaseError);
      throw new Error(`Failed to save plan: ${supabaseError.message}`);
    }

    return NextResponse.json({
      message: 'Plan generated and saved!',
      planId: planId,
    });

  } catch (error) {
    console.error('Error in /api/generate-plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function buildPrompt(data: UserProfileData): string {
  return `
    You are an expert AI Fitness Coach and Nutritionist.
    Generate a personalized, detailed, 7-day workout and diet plan based on the user data.

    **User Data:**
    - Name: ${data.name}
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Height: ${data.height} cm
    - Weight: ${data.weight} kg
    - Fitness Goal: ${data.fitnessGoal}
    - Current Fitness Level: ${data.fitnessLevel}
    - Workout Location: ${data.workoutLocation}
    - Dietary Preference: ${data.dietaryPreference}
    - Medical History (Optional): ${data.medicalHistory || 'None provided'}
    - Stress Level: ${data.stressLevel}

    **Instructions:**
    1.  **Workout Plan:** Create a 7-day schedule. Tailor exercises to location and fitness level. Include rest days.
    2.  **Diet Plan:** Create a 7-day meal plan. Align with dietary preference and fitness goal, using only ingredients that are broadly acceptable across diverse cultures and avoiding items that are commonly sensitive or restricted.
    3.  **Tips:** Provide 3-5 lifestyle tips.
    4.  Return the plan in the required structured JSON format.
    `;
}