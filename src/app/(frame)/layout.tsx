"use client";

import { usePathname } from "next/navigation";

import { Frame } from "@/components/frame/Frame";
import { useKeyboard } from "@/lib/keyboard";
import { useRouterSync } from "@/lib/routerSync";
import { useWheel } from "@/lib/wheel";

// Routes that render on the light (cream) canvas. Canvas stays route-derived
// for SSR-correct, flash-free first paint; routerSync keeps the URL in step
// with the navigation store, so this matches the store's mode in practice.
function isLightRoute(pathname: string): boolean {
  return (
    pathname === "/test/light" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname.startsWith("/writing")
  );
}

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Navigation behaviours — mounted once, run on every route in the group.
  useRouterSync();
  useKeyboard();
  useWheel();

  const canvas = isLightRoute(pathname) ? "light" : "dark";

  return (
    <div data-canvas={canvas}>
      <Frame>{children}</Frame>
    </div>
  );
}
