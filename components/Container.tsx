import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
};

export const containerClass = "mx-auto w-full max-w-[104.5rem] px-4 sm:px-16 md:px-9";

export default function Container({ as: Tag = "section", className = "", id, children }: Props) {
  return (
    <Tag id={id} className={`${containerClass} ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * Every section opens the same way: a hook, then the sentence that qualifies it.
 * The hook is set at display size (`text-3xl md:text-4xl`, the same step as
 * "One price. Clarity both ways.") and breaks onto its own line, so it carries
 * the section the way a headline should; the qualifying sentence stays a step
 * down and greyed, which is what keeps the hook reading as the loudest thing.
 */
export function SectionHeading({
  lead,
  children,
  className = "",
  id,
  as: Tag = "h2",
}: {
  lead: string;
  children: ReactNode;
  className?: string;
  id?: string;
  /** The intro uses the same hook at `h1`; every section below it is an `h2`. */
  as?: ElementType;
}) {
  return (
    <Tag id={id} className={`max-w-[52.25rem] font-medium ${className}`}>
      <span className="text-dark block text-3xl text-balance transition-colors duration-500 md:text-4xl">{lead}</span>
      <span className="text-dark-subtle mt-5 block text-xl lg:text-2xl">{children}</span>
    </Tag>
  );
}
