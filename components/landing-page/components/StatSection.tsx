'use client';

import Image from 'next/image';
import { NumberTicker } from './number-ticker';

const disasterFacts = [
  {
    value: 20,
    suffix: '+',
    label: 'Typhoons per Year',
    description:
      'The Philippines experiences an average of 20 typhoons annually, making it one of the most storm-prone countries.',
  },
  {
    value: 33000,
    suffix: '+',
    label: 'Earthquakes since 2019',
    description:
      'Located along the Pacific Ring of Fire, the country records thousands of earthquakes each year.',
  },
  {
    value: 10000,
    suffix: '+',
    label: 'Flood Events',
    description:
      'Flash floods and storm surges affect millions of Filipinos, especially in low-lying areas.',
  },
  {
    value: 109,
    suffix: 'M',
    label: 'People at Risk',
    description:
      'The entire population is vulnerable to natural disasters, requiring robust emergency response systems.',
  },
];

export function DisasterFactsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Why HERMES Matters
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance">
            The Philippines Faces{' '}
            <span className="text-muted-foreground">Constant Threats</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Stats Cards - Left Side */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
            {disasterFacts.map((fact, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5"
              >
                <div className="mb-3">
                  <span className="text-4xl md:text-5xl font-bold tracking-tight">
                    <NumberTicker
                      value={fact.value}
                      suffix={fact.suffix}
                      duration={2500}
                      delay={index * 150}
                    />
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{fact.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>

          {/* Philippine Map - Right Side */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.03] via-foreground/[0.08] to-foreground/[0.03] blur-3xl scale-150" />

              {/* Light mode map (black) */}
              <Image
                src="/images/philippines-map-black.png"
                alt="Map of the Philippines"
                width={550}
                height={825}
                className="relative block dark:hidden drop-shadow-[0_0_50px_rgba(0,0,0,0.2)] w-[350px] h-auto md:w-[450px] lg:w-[550px]"
              />

              {/* Dark mode map (white) */}
              <Image
                src="/images/philippines-map-white.png"
                alt="Map of the Philippines"
                width={550}
                height={825}
                className="relative hidden dark:block drop-shadow-[0_0_50px_rgba(255,255,255,0.25)] w-[350px] h-auto md:w-[450px] lg:w-[550px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
