import { FormEvent, useState } from 'react';
import HelloCube from './HelloCube';

export default function App() {
  const [input, setInput] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Placeholder — /interact and narrative come in a later phase
    setInput('');
  }

  return (
    <div className="app">
      <main className="viewport">
        <HelloCube />
      </main>
      <footer className="input-bar">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Speak to the EtherNet…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoComplete="off"
          />
          <button type="submit" className="input-submit">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
