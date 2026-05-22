"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Sets the navigation store to the Contact state on mount.
export function ContactMode() {
  const goContact = useNav((s) => s.goContact);
  useEffect(() => {
    goContact();
  }, [goContact]);
  return null;
}
