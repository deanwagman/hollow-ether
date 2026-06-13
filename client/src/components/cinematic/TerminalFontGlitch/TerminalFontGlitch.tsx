import { useEffect, useMemo, useRef, useState } from 'react';
import './TerminalFontGlitch.css';

export type TerminalFontGlitchIntensity = 'subtle' | 'medium' | 'severe';

export type TerminalFontGlitchProps = {
  text: string;
  corruptedText?: string;
  intensity?: TerminalFontGlitchIntensity;
  durationMs?: number;
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

export function TerminalFontGlitch({
  text,
  corruptedText,
  intensity = 'medium',
  durationMs = 1200,
  autoPlay = true,
  className,
  onComplete,
}: TerminalFontGlitchProps) {
  const [isGlitching, setIsGlitching] = useState(autoPlay);
  const [showCorrupted, setShowCorrupted] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  const fallbackCorruptedText = useMemo(() => createCorruptedText(text), [text]);
  const activeCorruptedText = corruptedText ?? fallbackCorruptedText;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!autoPlay) return;

    completedRef.current = false;
    setIsGlitching(true);

    const frameTimer = window.setInterval(() => {
      setShowCorrupted((current) => !current);
    }, 96);

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(frameTimer);
      setShowCorrupted(false);
      setIsGlitching(false);

      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    }, durationMs);

    return () => {
      window.clearInterval(frameTimer);
      window.clearTimeout(completeTimer);
    };
  }, [autoPlay, durationMs, text, activeCorruptedText]);

  return (
    <span
      className={['he-terminal-font-glitch', className].filter(Boolean).join(' ')}
      data-intensity={intensity}
      data-glitching={isGlitching || undefined}
      aria-label={text}
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
