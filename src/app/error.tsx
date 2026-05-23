"use client";

import { useEffect } from "react";

import Link from "next/link";

// 500 — catches uncaught runtime errors below the root layout. Error
// boundaries must be Client Components.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-[var(--frame-edge)] text-center">
      <p className="text-text-white-40">Something went wrong</p>
      <h1 className="mt-3 text-[2rem] font-bold leading-tight text-text-white">
        An unexpected error occurred
      </h1>
      <p className="mt-2 max-w-[420px] text-text-white-70">
        Sorry — something broke on our end. Try again, or head back home.
      </p>
      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => reset()}
          className="border border-text-white-40 px-4 py-2 text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:border-text-white hover:text-text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-white"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
