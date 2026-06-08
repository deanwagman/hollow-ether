import { pingDemoLlm } from './demoLlmApi';

type HealthResponse = {
  status: string;
  service: string;
};

export async function pingApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const data = (await res.json()) as HealthResponse;
    return data.status === 'ok';
  } catch {
    return false;
  }
}

export async function pingDevServices(): Promise<void> {
  const apiOk = await pingApi();
  if (apiOk) {
    console.debug('[ethernetic] API reachable at /api/health');
  } else {
    console.debug('[ethernetic] API ping failed — is the server running? (npm run dev)');
  }

  if (import.meta.env.VITE_LLM_DEMO !== 'true') return;

  const demo = await pingDemoLlm();
  if (demo?.ok) {
    console.debug(
      `[ethernetic] LLM demo ping ok (${demo.modelId}, ${demo.latencyMs}ms)`,
    );
  } else {
    console.debug(
      '[ethernetic] LLM demo ping failed — set DEMO_LLM_ENABLED=true in server/.env',
    );
  }
}
