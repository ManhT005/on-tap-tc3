import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type PageHeaderProps = {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  stacked?: boolean;
  className?: string;
};

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  stacked = true,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('page-header', stacked && 'page-header--stacked', className)}>
      <div className="page-header__content">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
      {action ? <div className="page-header__action">{action}</div> : null}
    </header>
  );
}
