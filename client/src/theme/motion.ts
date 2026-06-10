/** Slow ambient loops (particles, idle glow) */
export const BREATH_MS = 8000;

/** Scene / preset transitions — shared by CSS and R3F lerp */
export const TURN_MS = 600;

/** Send pulse, accept beat */
export const BEAT_MS = 250;

export const LITE_BREAKPOINT_PX = 768;

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

/** CSS line fade-in duration */
export const REVEAL_LINE_ENTER_MS = 300;

/** Scroll throttle during reveal */
export const REVEAL_SCROLL_EVERY_CHARS = 8;
