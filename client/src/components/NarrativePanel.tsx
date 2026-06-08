import { useEffect, useRef } from 'react';
import type { NarrativeLine } from '../game/types';

function MessageRow({
  message,
  spiritLabel,
}: {
  message: NarrativeLine;
  spiritLabel: string;
}) {
  const isPlayer = message.speaker === 'player';
  return (
    <p
      className={`narrative-message ${isPlayer ? 'narrative-message--player' : 'narrative-message--spirit'}`}
    >
      {!isPlayer && (
        <span className="narrative-message__speaker">{spiritLabel} — </span>
      )}
      {message.text}
    </p>
  );
}

type NarrativePanelProps = {
  messages: NarrativeLine[];
  isLoading?: boolean;
  spiritLabel?: string;
  subtitle?: string;
};

export default function NarrativePanel({
  messages,
  isLoading,
  spiritLabel = 'Luminia',
  subtitle,
}: NarrativePanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <section className="narrative-panel panel panel--ether" aria-label="Conversation">
      <header className="narrative-panel__header">
        <span className="text-label narrative-panel__spirit">{spiritLabel}</span>
        {subtitle ? (
          <p className="narrative-panel__subtitle">{subtitle}</p>
        ) : null}
      </header>
      <div className="narrative-panel__log">
        {isLoading && messages.length === 0 && (
          <p className="narrative-message narrative-message--player">Listening…</p>
        )}
        {messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            spiritLabel={spiritLabel}
          />
        ))}
        <div ref={logEndRef} />
      </div>
    </section>
  );
}
