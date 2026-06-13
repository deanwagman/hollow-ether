import { useEffect, useMemo, useRef, useState } from 'react';
import './TerminalSequence.css';

export type TerminalSequenceLine = {
  text: string;
  holdMs?: number;
  deleteAfter?: boolean;
};

export type TerminalSequenceProps = {
  lines: TerminalSequenceLine[];
  cursorBlinkCount?: number;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  startDelayMs?: number;
  className?: string;
  onComplete?: () => void;
};

type TerminalPhase = 'preBlink' | 'typing' | 'holding' | 'deleting' | 'complete';

const DEFAULT_HOLD_MS = 700;
const DEFAULT_BETWEEN_LINES_MS = 440;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function TerminalSequence({
  lines,
  cursorBlinkCount = 3,
  typingSpeedMs = 64,
  deletingSpeedMs = 34,
  startDelayMs = 350,
  className,
  onComplete,
}: TerminalSequenceProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<TerminalPhase>('preBlink');
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const normalizedLines = useMemo(
    () =>
      lines.map((line, index) => ({
        holdMs: DEFAULT_HOLD_MS,
        deleteAfter: index < lines.length - 1,
        ...line,
      })),
    [lines],
  );

  useEffect(() => {
    let cancelled = false;

    async function runSequence() {
      setPhase('preBlink');
      setDisplayedText('');

      await wait(startDelayMs + cursorBlinkCount * 520);
      if (cancelled) return;

      for (let lineIndex = 0; lineIndex < normalizedLines.length; lineIndex += 1) {
        const line = normalizedLines[lineIndex];

        setActiveLineIndex(lineIndex);
        setPhase('typing');

        for (let charIndex = 1; charIndex <= line.text.length; charIndex += 1) {
          if (cancelled) return;

          setDisplayedText(line.text.slice(0, charIndex));
          await wait(typingSpeedMs);
        }

        setPhase('holding');
        await wait(line.holdMs);
        if (cancelled) return;

        if (line.deleteAfter) {
          setPhase('deleting');

          for (let charIndex = line.text.length - 1; charIndex >= 0; charIndex -= 1) {
            if (cancelled) return;

            setDisplayedText(line.text.slice(0, charIndex));
            await wait(deletingSpeedMs);
          }

          await wait(DEFAULT_BETWEEN_LINES_MS);
        }
      }

      if (cancelled) return;

      setPhase('complete');

      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
    }

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [
    normalizedLines,
    cursorBlinkCount,
    typingSpeedMs,
    deletingSpeedMs,
    startDelayMs,
  ]);

  return (
    <div
      className={['he-terminal-sequence', className].filter(Boolean).join(' ')}
      data-phase={phase}
      data-active-line={activeLineIndex}
      aria-live="polite"
    >
      <span className="he-terminal-sequence__prompt" aria-hidden="true">
        {'>'}
      </span>

      <span className="he-terminal-sequence__text">{displayedText}</span>

      <span className="he-terminal-sequence__cursor" aria-hidden="true">
        █
      </span>
    </div>
  );
}
