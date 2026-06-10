import { useCallback, useEffect, useRef } from 'react';
import type { NarrativeLine } from '../game/types';
import { useSpiritReveal } from '../game/useSpiritReveal';
import { REVEAL_SCROLL_EVERY_CHARS } from '../theme/motion';
import { useReducedMotionPreference } from '../scenes/useReducedMotionPreference';
import RevealMessage from './RevealMessage';

function PlayerMessageRow({ message }: { message: NarrativeLine }) {
  return (
    <p className="narrative-message narrative-message--player">
      {message.text}
    </p>
  );
}

type NarrativePanelProps = {
  messages: NarrativeLine[];
  sessionId: string;
  isLoading?: boolean;
  isListening?: boolean;
  spiritLabel?: string;
  subtitle?: string;
  variant?: 'embedded' | 'panel';
  /** @deprecated Use variant="embedded" */
  embedded?: boolean;
  onRevealingChange?: (revealing: boolean) => void;
};

export default function NarrativePanel({
  messages,
  sessionId,
  isLoading,
  isListening,
  spiritLabel = 'Luminia',
  subtitle,
  variant,
  embedded = false,
  onRevealingChange,
}: NarrativePanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);
  const lastScrollMsRef = useRef(0);
  const lastScrollCharRef = useRef(0);
  const reducedMotion = useReducedMotionPreference();
  const reveal = useSpiritReveal(messages, { sessionId, reducedMotion });

  const isEmbedded = variant === 'embedded' || embedded;
  const rootClass = isEmbedded
    ? 'narrative-panel narrative-panel--embedded'
    : 'narrative-panel panel panel--ether';

  const scrollToEnd = useCallback((behavior: ScrollBehavior = 'smooth') => {
    logEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    onRevealingChange?.(reveal.isRevealing);
  }, [reveal.isRevealing, onRevealingChange]);

  useEffect(() => {
    if (!reveal.isRevealing) {
      scrollToEnd('smooth');
    }
  }, [messages.length, reveal.isRevealing, scrollToEnd]);

  const handleRevealProgress = useCallback(
    (_progress: number, visibleLength: number) => {
      const charDelta = visibleLength - lastScrollCharRef.current;
      if (charDelta < REVEAL_SCROLL_EVERY_CHARS && visibleLength > 0) return;

      const now = performance.now();
      if (now - lastScrollMsRef.current < 100) return;

      lastScrollCharRef.current = visibleLength;
      lastScrollMsRef.current = now;
      scrollToEnd('auto');
    },
    [scrollToEnd],
  );

  const handleMessageComplete = useCallback(
    (id: string) => {
      reveal.onMessageComplete(id);
      lastScrollCharRef.current = 0;
      scrollToEnd('smooth');
    },
    [reveal, scrollToEnd],
  );

  return (
    <section className={rootClass} aria-label="Dialogue">
      {!isEmbedded && (
        <header className="narrative-panel__header">
          <span className="text-label narrative-panel__spirit">{spiritLabel}</span>
          {subtitle ? (
            <p className="narrative-panel__subtitle">{subtitle}</p>
          ) : null}
        </header>
      )}
      <div
        className="suspended-narrative-layer__dialogue narrative-panel__log"
        aria-busy={reveal.isRevealing}
      >
        {isLoading && messages.length === 0 && (
          <p className="narrative-message narrative-message--player">Listening…</p>
        )}
        {messages.map((message) => {
          if (message.speaker === 'player') {
            return (
              <PlayerMessageRow key={message.id} message={message} />
            );
          }

          const phase = reveal.getRevealPhase(message.id);

          return (
            <RevealMessage
              key={message.id}
              text={message.text}
              phase={phase}
              reducedMotion={reducedMotion}
              onComplete={() => handleMessageComplete(message.id)}
              onProgress={
                phase === 'active' ? handleRevealProgress : undefined
              }
              spiritLabel={spiritLabel}
              showSpeakerPrefix={!isEmbedded}
            />
          );
        })}
        {isListening ? (
          <p className="narrative-message narrative-message--player">Listening…</p>
        ) : null}
        <div ref={logEndRef} />
      </div>
    </section>
  );
}
