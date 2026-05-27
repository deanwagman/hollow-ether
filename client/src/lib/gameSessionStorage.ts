const SESSION_ID_KEY = 'ethernetic_session_id';

export function getStoredSessionId(): string | null {
  try {
    return window.localStorage.getItem(SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export function setStoredSessionId(sessionId: string): void {
  try {
    window.localStorage.setItem(SESSION_ID_KEY, sessionId);
  } catch {
    // ignore (privacy mode / disabled storage)
  }
}

export function clearStoredSessionId(): void {
  try {
    window.localStorage.removeItem(SESSION_ID_KEY);
  } catch {
    // ignore
  }
}

