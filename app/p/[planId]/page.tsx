import { supabaseServer } from '@/lib/supabaseServer';
import ThemeToggle from '@/app/components/ThemeToggle';
import PlanDisplay from '@/app/components/PlanDisplay';
import QrCodeShare from '@/app/components/QrCodeShare';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plan } from '@/app/types';
import DailyQuote from '@/app/components/DailyQuote';
import { Metadata } from 'next';

async function getPlan(planId: string): Promise<Plan | null> {
  const { data, error } = await supabaseServer
    .from('plans')
    .select('generated_plan')
    .eq('id', planId)
    .single();

  if (error) {
    console.error('Error fetching plan:', error.message);
    return null;
  }

  return data.generated_plan as Plan;
}

export async function generateMetadata(
  { params }: { params: Promise<{ planId: string }> }
): Promise<Metadata> {
  const { planId } = await params;
  const plan = await getPlan(planId);

  if (!plan) {
    return {
      title: "Plan Not Found",
      description: "This fitness plan could not be found.",
    };
  }

  const planTitle = `Your 7-Day ${plan.workoutPlan[0].dayTitle || 'Fitness Plan'}`;
  const planDescription = `View your personalized AI-generated workout and diet plan. Includes ${plan.tips.length} lifestyle tips and daily motivation.`;

  return {
    title: planTitle,
    description: planDescription,
  };
}

export default async function PlanPage({ params }: { params: Promise<{ planId: string }> }) { 
  
  const { planId } = await params; 
  
  const plan = await getPlan(planId); 
  if (!plan) {
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

      <PlanDisplay plan={plan} />
      </div>
    </main>
  );
}