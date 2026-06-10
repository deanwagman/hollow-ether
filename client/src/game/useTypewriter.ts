import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  REVEAL_CHAR_MIN_MS,
  REVEAL_CHAR_MS,
  REVEAL_JITTER_MS,
  REVEAL_MAX_MS,
  REVEAL_PUNCTUATION_MS,
} from '../theme/motion';

const PUNCTUATION = new Set(['.', '?', '!', '…', '—']);

export function isPunctuationChar(char: string): boolean {
  return PUNCTUATION.has(char);
}

/** Base delay for one character (no jitter) — used for duration estimation */
export function getBaseCharDelay(char: string): number {
  const punctExtra = isPunctuationChar(char) ? REVEAL_PUNCTUATION_MS : 0;
  return REVEAL_CHAR_MS + punctExtra;
}

/** Per-character delay with optional jitter and line scale */
export function getCharDelay(char: string, scale = 1, jitter = 0): number {
  return Math.max(REVEAL_CHAR_MIN_MS, getBaseCharDelay(char) * scale + jitter);
}

/** Scale factor when estimated line duration exceeds REVEAL_MAX_MS */
export function computeRevealScale(text: string): number {
  let total = 0;
  for (const char of text) {
    total += getBaseCharDelay(char);
  }
  if (total <= REVEAL_MAX_MS) return 1;
  return REVEAL_MAX_MS / total;
}

export function useTypewriter(text: string, enabled: boolean) {
  const [visibleText, setVisibleText] = useState(enabled ? '' : text);
  const [isComplete, setIsComplete] = useState(!enabled);
  const [progress, setProgress] = useState(enabled ? 0 : 1);
  const wasEnabledRef = useRef(enabled);

  // Reset before paint when reveal starts — avoids stale isComplete from disabled path
  useLayoutEffect(() => {
    if (enabled && !wasEnabledRef.current) {
      setVisibleText('');
      setIsComplete(false);
      setProgress(0);
    }
    wasEnabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setVisibleText(text);
      setIsComplete(true);
      setProgress(1);
      return;
    }

    if (!text) {
      setVisibleText('');
      setIsComplete(true);
      setProgress(1);
      return;
    }

    const scale = computeRevealScale(text);
    let index = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    setVisibleText('');
    setIsComplete(false);
    setProgress(0);

    function scheduleNext() {
      if (cancelled) return;

      if (index >= text.length) {
        setVisibleText(text);
        setIsComplete(true);
        setProgress(1);
        return;
      }

      const char = text[index]!;
      const jitter = (Math.random() * 2 - 1) * REVEAL_JITTER_MS;
      const delay = getCharDelay(char, scale, jitter);

      timeoutId = setTimeout(() => {
        index += 1;
        const next = text.slice(0, index);
        setVisibleText(next);
        setProgress(index / text.length);
        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [text, enabled]);

  return { visibleText, isComplete, progress };
}
