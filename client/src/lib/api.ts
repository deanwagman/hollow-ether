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
