import type { GameState, SessionPayload } from '@ethernetic/shared';
import {
  clearStoredSessionId,
  getStoredSessionId,
  setStoredSessionId,
} from './gameSessionStorage';

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
    const error = new Error(`Failed to load session (${res.status})`);
    (error as Error & { status?: number }).status = res.status;
    throw error;
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

async function fetchSessionPayload(sessionId: string): Promise<SessionPayload> {
  const state = await getSession(sessionId);
  return { sessionId, state };
}

export async function loadOrCreateSession(): Promise<SessionPayload> {
  const stored = getStoredSessionId();

  if (stored) {
    try {
      const payload = await fetchSessionPayload(stored);
      setStoredSessionId(stored);
      return payload;
    } catch (error) {
      const status = (error as { status?: number } | undefined)?.status;
      if (status === 404 || status === 400) {
        clearStoredSessionId();
      } else {
        throw error;
      }
    }
  }

  const created = await createSession();
  setStoredSessionId(created.sessionId);
  return created;
}
