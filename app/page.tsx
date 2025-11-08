import UserProfileForm from './components/UserProfileForm'
import ThemeToggle from './components/ThemeToggle'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Your Plan",
  description: "Answer a few questions to generate your completely custom AI-powered fitness and nutrition plan.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div> 
        <UserProfileForm />
    </main>
  )
}