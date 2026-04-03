'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export function NewHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 pt-2 pb-20 md:pt-10 md:pb-32 w-full">
      {/* Grid background — full bleed */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Vignette — fades grid out on all 4 edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)
          `,
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Transform Your Business
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              With Innovation
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            We help businesses grow faster with cutting-edge solutions and
            exceptional service. Join thousands of satisfied customers.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group gap-2">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
