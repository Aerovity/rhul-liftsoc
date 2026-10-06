"use client";

import { useEffect, useRef } from "react";
import { mountBear } from "@/lib/bear";

/** The polar bear cub that chases your cursor, and the button to send him home. */
export function BearPet() {
  const bear = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bear.current || !toggle.current) return;
    return mountBear(bear.current, toggle.current);
  }, []);

  return (
    <>
      <div ref={bear} className="bear" aria-hidden="true">
        <div className="bear__body">
          <div className="bear__sprite" data-bear-sprite="" />
        </div>
      </div>
      <button ref={toggle} type="button" className="bear-toggle" data-bear-toggle="">
        <span className="bear-toggle__icon" />
      </button>
    </>
  );
}
