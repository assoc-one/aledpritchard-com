"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — sets the Contact state. Page content arrives in COS-142.
export default function ContactStub() {
  const goContact = useNav((s) => s.goContact);
  useEffect(() => {
    goContact();
  }, [goContact]);
  return null;
}
