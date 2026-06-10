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
    console.debug('[hollow-ether] API reachable at /api/health');
  } else {
    console.debug('[hollow-ether] API ping failed — is the server running? (npm run dev)');
  }
}
