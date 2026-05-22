import type { ReactNode } from "react";

export const metadata = {
  title: "Styleguide — Aled Pritchard",
};

const CANVAS_COLORS = [
  { name: "canvas-dark", value: "#000000", cls: "bg-canvas-dark" },
  { name: "canvas-light", value: "#edece6", cls: "bg-canvas-light" },
  { name: "canvas-red", value: "#d02614", cls: "bg-canvas-red" },
];

const TEXT_COLORS = [
  { name: "text-white", value: "#ffffff", cls: "bg-text-white" },
  { name: "text-white-70", value: "rgba(255,255,255,.7)", cls: "bg-text-white-70" },
  { name: "text-white-40", value: "rgba(255,255,255,.4)", cls: "bg-text-white-40" },
  { name: "text-dark", value: "#000000", cls: "bg-text-dark" },
  { name: "text-dark-70", value: "rgba(0,0,0,.7)", cls: "bg-text-dark-70" },
  { name: "text-dark-40", value: "rgba(0,0,0,.4)", cls: "bg-text-dark-40" },
];

const EASINGS = [
  {
    name: "ease-standard",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
    path: "M0,100 C40,100 20,0 100,0",
  },
  {
    name: "ease-out-strong",
    value: "cubic-bezier(0.16, 1, 0.3, 1)",
    path: "M0,100 C16,0 30,0 100,0",
  },
];

const DURATIONS = [
  { name: "duration-fast", value: "200ms" },
  { name: "duration-base", value: "400ms" },
  { name: "duration-slow", value: "600ms" },
];

const COLUMNS = [
  { name: "frame-col-details", value: "480px", cls: "w-[var(--frame-col-details)]" },
  { name: "frame-col-list", value: "320px", cls: "w-[var(--frame-col-list)]" },
  { name: "frame-edge", value: "32px", cls: "w-[var(--frame-edge)]" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-text-white-40 py-12">
      <h2 className="mb-8 text-text-white-40">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name, value, cls }: { name: string; value: string; cls: string }) {
  return (
    <div>
      <div className="relative h-20 w-full overflow-hidden ring-1 ring-text-white-40">
        {/* split backing so translucent tokens stay legible */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 bg-canvas-dark" />
          <div className="w-1/2 bg-text-white" />
        </div>
        <div className={`absolute inset-0 ${cls}`} />
      </div>
      <p className="mt-3 text-text-white">{name}</p>
      <p className="text-text-white-40">{value}</p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="min-h-screen pl-[var(--frame-col-details)]">
      <div className="max-w-[920px] px-[var(--frame-edge)] pb-24">
        <header className="py-16">
          <h1 className="text-display text-text-white">Styleguide</h1>
          <p className="mt-4 max-w-[420px] text-text-white-70">
            Every design token from the v4 prototype, rendered as live values.
          </p>
        </header>

        <Section title="Canvas">
          <div className="grid grid-cols-3 gap-6">
            {CANVAS_COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </Section>

        <Section title="Text colour">
          <div className="grid grid-cols-3 gap-6">
            {TEXT_COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-text-white-40">text-display — 96px</p>
              <p className="text-display text-text-white">Aa</p>
            </div>
            <div>
              <p className="text-text-white-40">text-body — 16px</p>
              <p className="text-body font-normal text-text-white">
                Regular 400 — the quick brown fox
              </p>
              <p className="text-body font-medium text-text-white">
                Medium 500 — the quick brown fox
              </p>
              <p className="text-body font-bold text-text-white">
                Bold 700 — the quick brown fox
              </p>
            </div>
          </div>
        </Section>

        <Section title="Easing">
          <div className="grid grid-cols-2 gap-6">
            {EASINGS.map((e) => (
              <div key={e.name}>
                <svg
                  viewBox="0 0 100 100"
                  className="h-32 w-full ring-1 ring-text-white-40"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="100"
                    x2="100"
                    y2="0"
                    className="stroke-text-white-40"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={e.path}
                    fill="none"
                    className="stroke-text-white"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <p className="mt-3 text-text-white">{e.name}</p>
                <p className="text-text-white-40">{e.value}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motion duration">
          <div className="flex flex-col gap-3">
            {DURATIONS.map((d) => (
              <div key={d.name} className="flex gap-6">
                <span className="w-40 text-text-white">{d.name}</span>
                <span className="text-text-white-40">{d.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Layout">
          <div className="flex flex-col gap-4">
            {COLUMNS.map((c) => (
              <div key={c.name} className="flex items-center gap-6">
                <div className={`${c.cls} h-6 bg-canvas-red`} />
                <span className="text-text-white">{c.name}</span>
                <span className="text-text-white-40">{c.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
