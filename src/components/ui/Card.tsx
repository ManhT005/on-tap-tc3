import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type CardProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
};

export function Card({ children, className, as: Component = 'div' }: CardProps) {
  return <Component className={cn('card', className)}>{children}</Component>;
}
