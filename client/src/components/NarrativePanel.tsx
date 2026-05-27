import { useEffect, useRef } from 'react';
import type { NarrativeLine } from '../game/types';

function MessageRow({ message }: { message: NarrativeLine }) {
  const isPlayer = message.speaker === 'player';
  return (
    <p
      className={`narrative-message ${isPlayer ? 'narrative-message--player' : 'narrative-message--spirit'}`}
    >
      {!isPlayer && <span className="narrative-message__speaker">Luminia — </span>}
      {message.text}
    </p>
  );
}

type NarrativePanelProps = {
  messages: NarrativeLine[];
  isLoading?: boolean;
};

export default function NarrativePanel({ messages, isLoading }: NarrativePanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <section className="narrative-panel panel panel--ether" aria-label="Conversation">
      <header className="narrative-panel__header">
        <span className="text-label narrative-panel__spirit">Luminia</span>
      </header>
      <div className="narrative-panel__log">
        {isLoading && messages.length === 0 && (
          <p className="narrative-message narrative-message--player">Listening…</p>
        )}
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
        <div ref={logEndRef} />
      </div>
    </section>
  );
}
