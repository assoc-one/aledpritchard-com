import Link from "next/link";

// 404 — also handles any URL that matches no route. Rendered by the root
// layout, outside the project frame, on the brand black canvas.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-[var(--frame-edge)] text-center">
      <p className="text-text-white-40">404</p>
      <h1 className="mt-3 text-[2rem] font-bold leading-tight text-text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-[420px] text-text-white-70">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or it may have
        moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-white"
      >
        ← Back to home
      </Link>
    </main>
  );
}
