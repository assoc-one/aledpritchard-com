"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — sets navigation state. The visible content (project list,
// visual layer) is driven by the frame; this provides the screen-reader
// heading the framed UI doesn't carry on its own.
export default function HomeStub() {
  const goHome = useNav((s) => s.goHome);
  useEffect(() => {
    goHome();
  }, [goHome]);
  return (
    <main className="sr-only">
      <h1>Selected work</h1>
    </main>
  );
}
