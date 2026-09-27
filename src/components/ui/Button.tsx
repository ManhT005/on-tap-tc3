import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'button',
        `button--${variant}`,
        `button--${size}`,
        loading && 'button--loading',
        disabled && 'button--disabled',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {leadingIcon ? <span className="button__icon">{leadingIcon}</span> : null}
      <span>{loading ? 'Đang tải...' : children}</span>
    </button>
  );
}
