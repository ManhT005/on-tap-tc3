import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type EmptyStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  headingLevel?: 'h1' | 'h2';
  role?: 'status' | 'alert';
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  headingLevel = 'h2',
  role,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel;

  return (
    <section className={cn('empty-state', 'card', className)} role={role}>
      <Heading>{title}</Heading>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </section>
  );
}
