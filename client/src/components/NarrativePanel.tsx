import { useEffect, useRef } from 'react';
import type { NarrativeLine } from '../game/types';

function MessageRow({
  message,
  spiritLabel,
  showSpeakerPrefix,
}: {
  message: NarrativeLine;
  spiritLabel: string;
  showSpeakerPrefix: boolean;
}) {
  const isPlayer = message.speaker === 'player';
  return (
    <p
      className={`narrative-message ${isPlayer ? 'narrative-message--player' : 'narrative-message--spirit'}`}
    >
      {!isPlayer && showSpeakerPrefix && (
        <span className="narrative-message__speaker">{spiritLabel} — </span>
      )}
      {message.text}
    </p>
  );
}

type NarrativePanelProps = {
  messages: NarrativeLine[];
  isLoading?: boolean;
  isListening?: boolean;
  spiritLabel?: string;
  subtitle?: string;
  variant?: 'embedded' | 'panel';
  /** @deprecated Use variant="embedded" */
  embedded?: boolean;
};

export default function NarrativePanel({
  messages,
  isLoading,
  isListening,
  spiritLabel = 'Luminia',
  subtitle,
  variant,
  embedded = false,
}: NarrativePanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);
  const isEmbedded = variant === 'embedded' || embedded;
  const rootClass = isEmbedded
    ? 'narrative-panel narrative-panel--embedded'
    : 'narrative-panel panel panel--ether';

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

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
      <div className="suspended-narrative-layer__dialogue narrative-panel__log">
        {isLoading && messages.length === 0 && (
          <p className="narrative-message narrative-message--player">Listening…</p>
        )}
        {messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            spiritLabel={spiritLabel}
            showSpeakerPrefix={!isEmbedded}
          />
        ))}
        {isListening ? (
          <p className="narrative-message narrative-message--player">Listening…</p>
        ) : null}
        <div ref={logEndRef} />
      </div>
    </section>
  );
}
