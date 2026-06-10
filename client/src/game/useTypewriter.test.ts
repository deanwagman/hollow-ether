import { describe, expect, it } from 'vitest';
import {
  computeRevealScale,
  getBaseCharDelay,
  getCharDelay,
  isPunctuationChar,
} from './useTypewriter';
import {
  REVEAL_CHAR_MS,
  REVEAL_MAX_MS,
  REVEAL_PUNCTUATION_MS,
} from '../theme/motion';

describe('getBaseCharDelay', () => {
  it('adds punctuation pause for sentence enders', () => {
    expect(getBaseCharDelay('a')).toBe(REVEAL_CHAR_MS);
    expect(getBaseCharDelay('.')).toBe(REVEAL_CHAR_MS + REVEAL_PUNCTUATION_MS);
    expect(isPunctuationChar('?')).toBe(true);
  });

  it('punctuation delay is longer than letter delay', () => {
    expect(getBaseCharDelay('.')).toBeGreaterThan(getBaseCharDelay('a'));
  });
});

describe('getCharDelay', () => {
  it('respects scale and jitter', () => {
    const scaled = getCharDelay('a', 0.5, 0);
    expect(scaled).toBe(REVEAL_CHAR_MS * 0.5);
  });

  it('clamps to REVEAL_CHAR_MIN_MS', () => {
    expect(getCharDelay('a', 0.01, 0)).toBeGreaterThanOrEqual(5);
  });
});

describe('computeRevealScale', () => {
  it('returns 1 for short text', () => {
    expect(computeRevealScale('Hello.')).toBe(1);
  });

  it('scales down long text under REVEAL_MAX_MS', () => {
    const longText = 'word '.repeat(400);
    const scale = computeRevealScale(longText);
    expect(scale).toBeLessThan(1);

    let estimated = 0;
    for (const char of longText) {
      estimated += getBaseCharDelay(char) * scale;
    }
    expect(estimated).toBeLessThanOrEqual(REVEAL_MAX_MS + 1);
  });
});
