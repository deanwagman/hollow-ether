import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './CinematicTextReveal.css';

export type CinematicTextRevealTone =
  | 'prose'
  | 'spirit'
  | 'memory'
  | 'sacred'
  | 'warning';

export type CinematicTextRevealLine = {
  id?: string;
  text: string;
  emphasis?: boolean;
  delayAfterMs?: number;
};

export type CinematicTextRevealProps = {
  lines: CinematicTextRevealLine[];
  tone?: CinematicTextRevealTone;
  startDelayMs?: number;
  lineDelayMs?: number;
  className?: string;
  onComplete?: () => void;
};

const DEFAULT_START_DELAY_MS = 2031;
const DEFAULT_LINE_DELAY_MS = 4219;

const lineVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const reducedLineVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function CinematicTextReveal({
  lines,
  tone = 'prose',
  startDelayMs = DEFAULT_START_DELAY_MS,
  lineDelayMs = DEFAULT_LINE_DELAY_MS,
  className,
  onComplete,
}: CinematicTextRevealProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const shouldReduceMotion = useReducedMotion();

  const activeLineVariants = shouldReduceMotion
    ? reducedLineVariants
    : lineVariants;

  const normalizedLines = useMemo(
    () =>
      lines.map((line, index) => ({
        id: line.id ?? String(index),
        delayAfterMs: lineDelayMs,
        ...line,
      })),
    [lines, lineDelayMs],
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;

    async function runReveal() {
      completedRef.current = false;
      setVisibleCount(0);

      await wait(startDelayMs);
      if (cancelled) return;

      for (let index = 0; index < normalizedLines.length; index += 1) {
        if (cancelled) return;

        setVisibleCount(index + 1);

        const line = normalizedLines[index];
        await wait(line.delayAfterMs);
      }

      if (cancelled) return;

      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    }

    runReveal();

    return () => {
      cancelled = true;
    };
  }, [normalizedLines, startDelayMs]);

  const visibleLines = normalizedLines.slice(0, visibleCount);

  return (
    <div
      className={['he-cinematic-text-reveal', className]
        .filter(Boolean)
        .join(' ')}
      data-tone={tone}
      aria-live="polite"
    >
      <AnimatePresence>
        {visibleLines.map((line) => (
          <motion.p
            key={line.id}
            className="he-cinematic-text-reveal__line"
            data-emphasis={line.emphasis || undefined}
            variants={activeLineVariants}
            initial="hidden"
            animate="visible"
          >
            {line.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
