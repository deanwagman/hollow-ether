import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeTone =
  | 'default'
  | 'stable'
  | 'protected'
  | 'warning'
  | 'danger'
  | 'corrupted'
  | 'memory'
  | 'sacred';

export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
};

export function Badge({
  children,
  tone = 'default',
  size = 'sm',
  icon,
  className,
}: BadgeProps) {
  const classes = ['he-badge', className].filter(Boolean).join(' ');

  return (
    <span className={classes} data-tone={tone} data-size={size}>
      {icon && <span className="he-badge__icon">{icon}</span>}
      <span className="he-badge__label">{children}</span>
    </span>
  );
}
