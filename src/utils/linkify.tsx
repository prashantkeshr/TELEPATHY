import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/g;

/** Splits plain text into safe React nodes, turning URLs into anchors.
 * Never uses innerHTML — every part is a real React text/element node, so
 * there's no injection surface no matter what a peer sends (spec §68/§69). */
export function linkify(text: string): ReactNode[] {
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) => {
    if (part.match(URL_PATTERN)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
