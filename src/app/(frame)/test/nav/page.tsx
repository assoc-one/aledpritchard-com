"use client";

import { TEMP_PROJECTS } from "@/lib/_temp-projects";
import { useNav } from "@/lib/navigation";

const SAMPLE_ARTICLE = "clarity-direction-momentum";

function Button({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-text-white-40 px-3 py-1.5 text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:border-text-white hover:text-text-white"
    >
      {label}
    </button>
  );
}

// Debug route for COS-138 — drives every navigation action and shows the
// live store state. Keyboard (arrows / M / Esc) and wheel also work here.
export default function TestNavPage() {
  const nav = useNav();

  const snapshot = {
    mode: nav.mode,
    projectIndex: nav.projectIndex,
    slideIndex: nav.slideIndex,
    articleSlug: nav.articleSlug,
    returnTo: nav.returnTo,
  };

  const actions: { label: string; onClick: () => void }[] = [
    { label: "goHome", onClick: nav.goHome },
    { label: "nextProject ↓", onClick: nav.nextProject },
    { label: "prevProject ↑", onClick: nav.prevProject },
    { label: "nextStep →", onClick: nav.nextStep },
    { label: "prevStep ←", onClick: nav.prevStep },
    { label: "enterSlides", onClick: nav.enterSlides },
    { label: "toggleMenu (M)", onClick: nav.toggleMenu },
    { label: "escape (Esc)", onClick: nav.escape },
    { label: "goAbout", onClick: nav.goAbout },
    { label: "goContact", onClick: nav.goContact },
    { label: "goWriting", onClick: nav.goWriting },
  ];

  return (
    <main className="min-h-screen overflow-y-auto py-[var(--frame-edge)] pl-[calc(var(--frame-col-details)_+_var(--frame-col-list))] pr-[var(--frame-edge)]">
      <h1 className="mb-2 text-text-white">Navigation debug</h1>
      <p className="mb-6 max-w-[520px] text-text-white-40">
        COS-138 — drive the store directly with the buttons below. Keyboard
        (↑ ↓ ← → / M / Esc) and wheel-scroll over the list column also work.
      </p>

      <pre className="mb-8 border border-text-white-40 p-4 text-text-white">
        {JSON.stringify(snapshot, null, 2)}
      </pre>

      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <Button key={a.label} label={a.label} onClick={a.onClick} />
        ))}
        {TEMP_PROJECTS.map((p, i) => (
          <Button
            key={p.slug}
            label={`goToProject · ${p.slug}`}
            onClick={() => nav.goToProject(i)}
          />
        ))}
        <Button
          label={`openArticle · ${SAMPLE_ARTICLE}`}
          onClick={() => nav.openArticle(SAMPLE_ARTICLE)}
        />
      </div>
    </main>
  );
}
