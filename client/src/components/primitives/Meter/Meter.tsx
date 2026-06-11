import './Meter.css';

export type MeterTone =
  | 'stable'
  | 'protected'
  | 'warning'
  | 'danger'
  | 'corrupted'
  | 'memory';

export type MeterSize = 'sm' | 'md' | 'lg';

export type MeterProps = {
  label: string;
  value: number;
  max?: number;
  tone?: MeterTone;
  size?: MeterSize;
  showValue?: boolean;
  valueLabel?: string;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function Meter({
  label,
  value,
  max = 100,
  tone = 'stable',
  size = 'md',
  showValue = true,
  valueLabel,
  className,
}: MeterProps) {
  const safeMax = max <= 0 ? 100 : max;
  const safeValue = clamp(value, 0, safeMax);
  const percent = Math.round((safeValue / safeMax) * 100);
  const displayValue = valueLabel ?? `${percent}%`;

  const classes = ['he-meter', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-tone={tone}
      data-size={size}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-valuetext={displayValue}
    >
      <div className="he-meter__header">
        <span className="he-meter__label">{label}</span>
        {showValue && <span className="he-meter__value">{displayValue}</span>}
      </div>

      <div className="he-meter__track">
        <div
          className="he-meter__fill"
          style={{ inlineSize: `${percent}%` }}
        />
      </div>
    </div>
  );
}
