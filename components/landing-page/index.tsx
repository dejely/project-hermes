import { AuthButton } from '@/components/auth-button';
import { Suspense } from 'react';
import { NewHeroSection as HeroSection } from './components/HeroSection';
import { Navbar } from './components/NavBar';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar
          authButton={
            <Suspense>
              <AuthButton />
            </Suspense>
          }
        />
        <HeroSection />
      </div>
    </main>
  );
}
