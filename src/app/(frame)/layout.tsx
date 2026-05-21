"use client";

import { usePathname } from "next/navigation";

import { Frame } from "@/components/frame/Frame";

// Routes that render on the light (cream) canvas. About / Contact / Writing
// will join this list in later features. COS-138 will replace this static
// map with the navigation state machine.
const LIGHT_ROUTES = ["/test/light"];

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const canvas = LIGHT_ROUTES.includes(pathname) ? "light" : "dark";

  return (
    <div data-canvas={canvas}>
      <Frame>{children}</Frame>
    </div>
  );
}
