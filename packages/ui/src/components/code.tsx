import { type JSX } from "react";

export interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export function Code({
  children,
  className,
}: CodeProps): JSX.Element {
  return <code className={className}>{children}</code>;
}
