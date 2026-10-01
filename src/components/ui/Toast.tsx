import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type ToastProps = {
  children: ReactNode;
  tone?: 'info' | 'success' | 'error';
  className?: string;
};

export function Toast({ children, tone = 'info', className }: ToastProps) {
  const isError = tone === 'error';

  return (
    <div
      className={cn('toast', `toast--${tone}`, className)}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {children}
    </div>
  );
}
