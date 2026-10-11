import type { CSSProperties } from 'react';

import { cn } from '../../utils/cn';

export type SkeletonProps = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  className?: string;
};

export function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <span aria-hidden="true" className={cn('skeleton', className)} style={{ width, height }} />
  );
}
