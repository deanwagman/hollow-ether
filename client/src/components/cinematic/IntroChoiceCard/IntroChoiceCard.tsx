import type { ButtonHTMLAttributes } from 'react';
import './IntroChoiceCard.css';

export type IntroChoiceTone =
  | 'default'
  | 'signal'
  | 'memory'
  | 'warning'
  | 'silence';

export type IntroChoiceCardProps = {
  label: string;
  eyebrow?: string;
  description?: string;
  tone?: IntroChoiceTone;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'disabled'>;

export function IntroChoiceCard({
  label,
  eyebrow,
  description,
  tone = 'default',
  selected = false,
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...buttonProps
}: IntroChoiceCardProps) {
  return (
    <button
      className={['he-intro-choice-card', className].filter(Boolean).join(' ')}
      type={type}
      data-tone={tone}
      data-selected={selected || undefined}
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      <span className="he-intro-choice-card__signal" aria-hidden="true">
        {'>'}
      </span>

      <span className="he-intro-choice-card__content">
        {eyebrow && (
          <span className="he-intro-choice-card__eyebrow">{eyebrow}</span>
        )}

        <span className="he-intro-choice-card__label">{label}</span>

        {description && (
          <span className="he-intro-choice-card__description">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
