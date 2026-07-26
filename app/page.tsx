import { SITE } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-brand">{SITE.name}</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {SITE.tagline}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Landing page content ships in Phase 3.
      </p>
    </div>
  );
}
