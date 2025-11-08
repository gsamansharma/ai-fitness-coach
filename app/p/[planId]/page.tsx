import { supabaseServer } from '@/lib/supabaseServer';
import ThemeToggle from '@/app/components/ThemeToggle';
import PlanDisplay from '@/app/components/PlanDisplay';
import QrCodeShare from '@/app/components/QrCodeShare';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plan, UserProfileData  } from '@/app/types';
import DailyQuote from '@/app/components/DailyQuote';
import { Metadata } from 'next';

async function getPlan(planId: string): Promise<{ plan: Plan, userInputs: UserProfileData } | null> {
  const { data, error } = await supabaseServer
    .from('plans')
    .select('generated_plan, user_inputs')
    .eq('id', planId)
    .single();

  if (error) {
    console.error('Error fetching plan:', error.message);
    return null;
  }

  return {
    plan: data.generated_plan as Plan,
    userInputs: data.user_inputs as UserProfileData
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ planId: string }> }
): Promise<Metadata> {
  const { planId } = await params;
  const planData = await getPlan(planId);

  if (!planData) {
    return {
      title: "Plan Not Found",
      description: "This fitness plan could not be found.",
    };
  }

  const planTitle = `Your 7-Day ${planData.plan.workoutPlan[0].dayTitle || 'Fitness Plan'}`;
  const planDescription = `View your personalized AI-generated workout and diet plan. Includes ${planData.plan.tips.length} lifestyle tips and daily motivation.`;

  return {
    title: planTitle,
    description: planDescription,
  };
}

export default async function PlanPage({ params }: { params: Promise<{ planId: string }> }) { 
  
  const { planId } = await params; 
  
  const planData = await getPlan(planId); 
  if (!planData) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-(--background-color) p-4 md:p-8">
      <div className="absolute top-4 right-4 z-10">
        <QrCodeShare />
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href="/"
          className="px-4 py-2 rounded-lg bg-(--surface-color) text-(--font-color) hover:bg-(--font-color)/10 transition-all text-sm font-medium"
        >
          &larr; Create New Plan
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-16 md:mt-24 px-4 pb-8">
        <DailyQuote />

      <PlanDisplay plan={planData.plan} userInputs={planData.userInputs} />
      </div>
    </main>
  );
}