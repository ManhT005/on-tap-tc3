import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type BadgeProps = {
  children: ReactNode;
  tone?: 'primary' | 'neutral' | 'purple' | 'blue' | 'amber' | 'rose';
  className?: string;
};

export function Badge({ children, tone = 'primary', className }: BadgeProps) {
  return <span className={cn('badge', `badge--${tone}`, className)}>{children}</span>;
}
