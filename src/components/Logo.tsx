import type { SVGProps } from "react";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";

/**
 * The crest path is ~40KB, so it ships once and every logo on the page
 * references it with <use>. Stroke, dash and fill properties are inherited,
 * which is what lets the loader and the join section draw it on.
 */
export function LogoDefs() {
  return (
    <svg className="logo-defs" aria-hidden="true" focusable="false">
      <defs>
        <path id="ls-logo" data-logo-source="" fillRule="evenodd" d={LOGO_PATH} />
        <linearGradient id="ls-silver" x1="0" y1="0" x2="0" y2="328" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".4" stopColor="#b8b8b8" />
          <stop offset=".6" stopColor="#f4f4f4" />
          <stop offset="1" stopColor="#8a8a8a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type LogoProps = SVGProps<SVGSVGElement> & {
  /** attributes for the <use>, which is what gets animated */
  useProps?: SVGProps<SVGUseElement> & { [key: `data-${string}`]: string };
};

export function Logo({ useProps, viewBox = LOGO_VIEWBOX, ...props }: LogoProps) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" {...props}>
      <use href="#ls-logo" {...useProps} />
    </svg>
  );
}
