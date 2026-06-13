import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './TerminalFontGlitch.css';

export type TerminalFontGlitchIntensity = 'subtle' | 'medium' | 'severe';

export type TerminalFontGlitchPhase = 'idle' | 'glitching' | 'fading';

export type TerminalFontGlitchProps = {
  text: string;
  corruptedText?: string;
  intensity?: TerminalFontGlitchIntensity;
  durationMs?: number;
  fadeOutMs?: number;
  autoPlay?: boolean;
  className?: string;
  onComplete?: () => void;
};

function createCorruptedText(text: string) {
  return text
    .split('')
    .map((char, index) => {
      if (char === ' ') return ' ';
      if (index % 7 === 0) return '';
      if (index % 11 === 0) return '·';
      return char;
    })
    .join('');
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function TerminalFontGlitch({
  text,
  corruptedText,
  intensity = 'medium',
  durationMs = 1200,
  fadeOutMs = 500,
  autoPlay = true,
  className,
  onComplete,
}: TerminalFontGlitchProps) {
  const [phase, setPhase] = useState<TerminalFontGlitchPhase>(
    autoPlay ? 'glitching' : 'idle',
  );
  const [showCorrupted, setShowCorrupted] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  const fallbackCorruptedText = useMemo(() => createCorruptedText(text), [text]);
  const activeCorruptedText = corruptedText ?? fallbackCorruptedText;
  const isGlitching = phase === 'glitching';

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!autoPlay) return;

    let cancelled = false;
    let frameTimer: number | null = null;

    async function runSequence() {
      completedRef.current = false;
      setPhase('glitching');
      setShowCorrupted(false);

      frameTimer = window.setInterval(() => {
        setShowCorrupted((current) => !current);
      }, 96);

      await wait(durationMs);
      if (cancelled) return;

      if (frameTimer) {
        window.clearInterval(frameTimer);
        frameTimer = null;
      }

      setShowCorrupted(false);

      if (fadeOutMs > 0) {
        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
          });
        });
        if (cancelled) return;

        setPhase('fading');
        await wait(fadeOutMs);
        if (cancelled) return;
      }

      setPhase('idle');

      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    }

    runSequence();

    return () => {
      cancelled = true;

      if (frameTimer) {
        window.clearInterval(frameTimer);
      }
    };
  }, [autoPlay, durationMs, fadeOutMs, text, activeCorruptedText]);

  return (
    <span
      className={['he-terminal-font-glitch', className].filter(Boolean).join(' ')}
      data-intensity={intensity}
      data-glitching={isGlitching || undefined}
      data-fading={phase === 'fading' || undefined}
      aria-label={text}
      style={
        {
          '--he-terminal-glitch-fade-duration': `${fadeOutMs}ms`,
        } as CSSProperties
      }
    >
      <span className="he-terminal-font-glitch__prompt" aria-hidden="true">
        {'>'}
      </span>

      <span className="he-terminal-font-glitch__text" aria-hidden="true">
        {showCorrupted ? activeCorruptedText : text}
      </span>

      {isGlitching && (
        <>
          <span
            className="he-terminal-font-glitch__ghost he-terminal-font-glitch__ghost--a"
            aria-hidden="true"
          >
            {text}
          </span>

          <span
            className="he-terminal-font-glitch__ghost he-terminal-font-glitch__ghost--b"
            aria-hidden="true"
          >
            {activeCorruptedText}
          </span>
        </>
      )}
    </span>
  );
}
