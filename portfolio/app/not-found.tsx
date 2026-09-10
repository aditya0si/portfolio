import Link from "next/link";

export default function NotFound() {
  return (
    <div className="blueprint-bg flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-sheet px-5 sm:px-8">
        <p className="mono-label mb-4">
          <span className="text-accent">[404]</span> ROUTE NOT FOUND
        </p>
        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
          DEAD END<span className="cursor-blink text-accent">▮</span>
        </h1>
        <p className="mt-5 max-w-md text-base text-ink2">
          This route doesn&rsquo;t exist — or it was refactored away. The main
          site is one click back.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back home ←
        </Link>
      </div>
    </div>
  );
}
