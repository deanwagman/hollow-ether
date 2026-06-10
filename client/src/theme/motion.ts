/** Spirit dialogue typewriter — per character */
export const REVEAL_CHAR_MS = 35;

/** Random ± jitter applied per character */
export const REVEAL_JITTER_MS = 10;

/** Extra pause after sentence punctuation */
export const REVEAL_PUNCTUATION_MS = 200;

/** Pause between queued spirit lines */
export const REVEAL_LINE_MS = 400;

/** Max total duration per line before acceleration */
export const REVEAL_MAX_MS = 10_000;

/** Floor per character when accelerated */
export const REVEAL_CHAR_MIN_MS = 5;
