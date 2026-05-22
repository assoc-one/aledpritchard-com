"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — sets the Writing state. Page content arrives in a later feature.
export default function WritingStub() {
  const goWriting = useNav((s) => s.goWriting);
  useEffect(() => {
    goWriting();
  }, [goWriting]);
  return null;
}
