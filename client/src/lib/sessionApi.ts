import type { GameState, SessionPayload } from '@ethernetic/shared';

export async function createSession(): Promise<SessionPayload> {
  const res = await fetch('/api/sessions', { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Failed to create session (${res.status})`);
  }
  return res.json() as Promise<SessionPayload>;
}

export async function getSession(sessionId: string): Promise<GameState> {
  const res = await fetch(`/api/sessions/${sessionId}`);
  if (!res.ok) {
    throw new Error(`Failed to load session (${res.status})`);
  }
  const data = (await res.json()) as { state: GameState };
  return data.state;
}

export async function interact(sessionId: string, text: string): Promise<GameState> {
  const res = await fetch(`/api/sessions/${sessionId}/interact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Failed to interact (${res.status})`);
  }
  const data = (await res.json()) as { state: GameState };
  return data.state;
}
