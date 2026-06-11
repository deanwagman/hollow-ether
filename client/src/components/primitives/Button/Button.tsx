import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'ghost'
  | 'sacred'
  | 'danger'
  | 'corrupted';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['he-button', className].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      type={type}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? 'true' : undefined}
      {...props}
    >
      {leftIcon && <span className="he-button__icon">{leftIcon}</span>}
      <span className="he-button__label">{children}</span>
      {rightIcon && <span className="he-button__icon">{rightIcon}</span>}
    </button>
  );
}
