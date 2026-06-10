import type { ReactNode } from 'react';
import './Panel.css';

export type PanelVariant =
  | 'default'
  | 'elevated'
  | 'active'
  | 'sacred'
  | 'danger'
  | 'corrupted';

export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

export type PanelProps = {
  variant?: PanelVariant;
  padding?: PanelPadding;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({
  variant = 'default',
  padding = 'md',
  eyebrow,
  title,
  children,
  className,
}: PanelProps) {
  const classes = ['he-panel', 'he-surface', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={classes}
      data-surface={variant}
      data-padding={padding === 'none' ? undefined : padding}
    >
      {(eyebrow || title) && (
        <header className="he-panel__header">
          {eyebrow && <p className="he-label">{eyebrow}</p>}
          {title && <h2 className="he-heading">{title}</h2>}
        </header>
      )}

      <div className="he-panel__content">{children}</div>
    </section>
  );
}
