import { supabaseServer } from '@/lib/supabaseServer';
import ThemeToggle from '@/app/components/ThemeToggle';
import PlanDisplay from '@/app/components/PlanDisplay';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plan } from '@/app/types';

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

export default async function PlanPage({ params }: { params: Promise<{ planId: string }> }) { 
  
  const { planId } = await params; 
  
  const plan = await getPlan(planId); 
  if (!plan) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-(--background-color) p-4 md:p-8">
      <div className="absolute top-4 right-4 z-10">
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

      <PlanDisplay plan={plan} />
    </main>
  );
}