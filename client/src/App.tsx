import { FormEvent, useState } from 'react';
import EtherNexusScene from './scenes/EtherNexusScene';

export default function App() {
  const [input, setInput] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Placeholder — /interact and narrative come in a later phase
    setInput('');
  }

  return (
    <div className="app">
      <h1 className="app-title text-heading">EtherNetic</h1>
      <main className="viewport">
        <EtherNexusScene />
      </main>
      <footer className="input-bar panel panel--ether">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Speak to the EtherNet…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoComplete="off"
          />
          <button type="submit" className="btn btn--nav">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
