import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Splits text into per-word (or per-letter) spans at render time, so the
 * motion layer can animate them without ever rewriting React's DOM.
 *
 * - `words` + `mask`: each word sits in an overflow mask and rises into view
 * - `words`: bare word spans, for the scrubbed opacity read-through
 * - `chars`: one span per letter
 *
 * Nested elements such as <em> keep their tag and are split inside; <br/>
 * passes through untouched.
 */
export function split(node: ReactNode, mode: "words" | "chars", mask = false): ReactNode {
  return Children.map(node, (child, i) => {
    if (typeof child === "string" || typeof child === "number") {
      return splitText(String(child), mode, mask, i);
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.type !== "br") {
      return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
        children: split(child.props.children, mode, mask),
      });
    }
    return child;
  });
}

function splitText(text: string, mode: "words" | "chars", mask: boolean, key: number) {
  if (mode === "chars") {
    return [...text].map((ch, i) => (
      <span key={`${key}-${i}`} className="c" data-c="">
        {ch === " " ? " " : ch}
      </span>
    ));
  }
  return text.split(/(\s+)/).map((part, i) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return " ";
    const word = (
      <span key={`${key}-${i}`} className="w" data-w="">
        {part}
      </span>
    );
    return mask ? (
      <span key={`${key}-${i}`} className="w-mask">
        {word}
      </span>
    ) : (
      word
    );
  });
}
