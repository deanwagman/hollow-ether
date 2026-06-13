import type { CSSProperties } from 'react';
import './AuralithPresence.css';

export type AuralithPresenceIntensity = 'faint' | 'soft' | 'awake';

export type AuralithPresenceProps = {
  visible?: boolean;
  intensity?: AuralithPresenceIntensity;
  showMotes?: boolean;
  /** Dims the effect for legibility when layered behind prose text. */
  behindProse?: boolean;
  className?: string;
};

const MOTE_COUNT = 9;

export function AuralithPresence({
  visible = true,
  intensity = 'soft',
  showMotes = true,
  behindProse = false,
  className,
}: AuralithPresenceProps) {
  return (
    <div
      className={['he-auralith-presence', className].filter(Boolean).join(' ')}
      data-visible={visible || undefined}
      data-intensity={intensity}
      data-behind-prose={behindProse || undefined}
      aria-hidden="true"
    >
      <div className="he-auralith-presence__bloom" />
      <div className="he-auralith-presence__ripple he-auralith-presence__ripple--outer" />
      <div className="he-auralith-presence__ripple he-auralith-presence__ripple--inner" />
      <div className="he-auralith-presence__beam" />
      <div className="he-auralith-presence__core" />

      {showMotes && (
        <div className="he-auralith-presence__motes">
          {Array.from({ length: MOTE_COUNT }).map((_, index) => (
            <span
              key={index}
              className="he-auralith-presence__mote"
              style={
                {
                  '--he-mote-index': index,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
