"use client";

import { useEffect } from "react";
import { startExperience } from "@/lib/motion";

/** Mounts the scroll + motion layer over the server-rendered page. */
export function Experience() {
  useEffect(() => startExperience(), []);
  return null;
}
