import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Card } from './Card';

export type StatTileProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function StatTile({ label, value, className }: StatTileProps) {
  return (
    <Card as="article" className={cn('stat-card', className)}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </Card>
  );
}
