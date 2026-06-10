import { useEffect, useRef } from 'react';
import { useTypewriter } from '../game/useTypewriter';
import type { RevealPhase } from '../game/useSpiritReveal';

type RevealMessageProps = {
  text: string;
  phase: RevealPhase;
  reducedMotion: boolean;
  onComplete: () => void;
  onProgress?: (progress: number, visibleLength: number) => void;
  className?: string;
  spiritLabel?: string;
  showSpeakerPrefix?: boolean;
};

type ActiveRevealMessageProps = Omit<RevealMessageProps, 'phase' | 'reducedMotion'>;

/** Typewriter only mounts when active — avoids stale disabled effects from a pending render */
function ActiveRevealMessage({
  text,
  onComplete,
  onProgress,
  className = 'narrative-message narrative-message--spirit',
  spiritLabel = 'Luminia',
  showSpeakerPrefix = false,
}: ActiveRevealMessageProps) {
  const completedRef = useRef(false);
  const { visibleText, isComplete, progress } = useTypewriter(text, true);

  useEffect(() => {
    completedRef.current = false;
  }, [text]);

  useEffect(() => {
    if (!isComplete || completedRef.current) return;
    if (visibleText.length < text.length) return;
    completedRef.current = true;
    onComplete();
  }, [isComplete, visibleText, text, onComplete]);

  useEffect(() => {
    onProgress?.(progress, visibleText.length);
  }, [progress, visibleText.length, onProgress]);

  return (
    <p
      className={`${className} narrative-message--entering`}
      aria-label={text}
    >
      {showSpeakerPrefix && (
        <span className="narrative-message__speaker">{spiritLabel} — </span>
      )}
      {visibleText}
    </p>
  );
}

export default function RevealMessage({
  text,
  phase,
  reducedMotion,
  onComplete,
  onProgress,
  className = 'narrative-message narrative-message--spirit',
  spiritLabel = 'Luminia',
  showSpeakerPrefix = false,
}: RevealMessageProps) {
  if (phase === 'pending') {
    return null;
  }

  if (phase === 'complete' || reducedMotion) {
    return (
      <p className={className} aria-label={text}>
        {showSpeakerPrefix && (
          <span className="narrative-message__speaker">{spiritLabel} — </span>
        )}
        {text}
      </p>
    );
  }

  return (
    <ActiveRevealMessage
      text={text}
      onComplete={onComplete}
      onProgress={onProgress}
      className={className}
      spiritLabel={spiritLabel}
      showSpeakerPrefix={showSpeakerPrefix}
    />
  );
}
