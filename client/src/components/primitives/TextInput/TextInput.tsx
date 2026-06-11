import type { InputHTMLAttributes } from 'react';
import './TextInput.css';

export type TextInputTone =
  | 'default'
  | 'active'
  | 'sacred'
  | 'danger'
  | 'corrupted';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  tone?: TextInputTone;
  fullWidth?: boolean;
};

export function TextInput({
  label,
  helperText,
  errorText,
  tone = 'default',
  fullWidth = false,
  className,
  id,
  ...props
}: TextInputProps) {
  const inputId = id ?? props.name;
  const effectiveTone = errorText ? 'danger' : tone;
  const classes = ['he-text-input-field', className].filter(Boolean).join(' ');

  return (
    <label
      className="he-text-input"
      data-tone={effectiveTone}
      data-full-width={fullWidth ? 'true' : undefined}
    >
      {label && <span className="he-text-input__label">{label}</span>}

      <input id={inputId} className={classes} {...props} />

      {(errorText || helperText) && (
        <span className="he-text-input__message">
          {errorText ?? helperText}
        </span>
      )}
    </label>
  );
}
