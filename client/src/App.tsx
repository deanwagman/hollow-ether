import { FormEvent, useEffect, useState } from 'react';
import NarrativePanel from './components/NarrativePanel';
import { useGameStore } from './game/useGameStore';
import EtherNexusScene from './scenes/EtherNexusScene';

export default function App() {
  const [input, setInput] = useState('');
  const submitInput = useGameStore((s) => s.submitInput);
  const seedOpening = useGameStore((s) => s.seedOpening);
  const inputDisabled = useGameStore((s) => s.inputDisabled);

  useEffect(() => {
    seedOpening();
  }, [seedOpening]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || inputDisabled) return;
    submitInput(trimmed);
    setInput('');
  }

  const placeholder = inputDisabled
    ? 'Act 1 complete — Elara awaits (coming soon).'
    : 'Speak to the EtherNet…';

  return (
    <div className="app">
      <main className="viewport">
        <p className="scene-label text-label">Ether Nexus</p>
        <EtherNexusScene />
      </main>
      <NarrativePanel />
      <footer className="input-bar panel panel--ether">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoComplete="off"
            disabled={inputDisabled}
          />
          <button type="submit" className="btn btn--nav" disabled={inputDisabled}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
