import UserProfileForm from './components/UserProfileForm'
import ThemeToggle from './components/ThemeToggle'

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