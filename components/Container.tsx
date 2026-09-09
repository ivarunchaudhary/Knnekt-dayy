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

export function SectionHeading({ lead, children, className = "", id }: { lead: string; children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={`text-dark-subtle font-medium text-xl lg:text-2xl max-w-[52.25rem] ${className}`}>
      <span className="text-dark transition-colors duration-500">{lead}</span> {children}
    </h2>
  );
}
