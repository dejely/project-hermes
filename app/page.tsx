import LandingPage from '@/components/landing-page';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/" className="font-semibold flex items-center">
              <Logo className="block sm:hidden" />
              <Wordmark className="hidden sm:block md:hidden" />
              <WordmarkLogo className="hidden md:block" />
            </Link>
            <div className="flex gap-4 items-center">
              <Suspense>
                <AuthButton />
              </Suspense>
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-12 max-w-2xl p-5 items-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Welcome</h1>
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-border py-8 mt-auto">
        <div className="mx-auto max-w-5xl px-5 flex justify-center">
          <p className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Terms of Service
            </Link>
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            <Link
              href="/status"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Status
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
