import { useMemo } from 'react';

/** Keep point sprites small on Retina — avoids additive white blobs */
export function useParticleSize(worldSize: number): number {
  return useMemo(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    return worldSize / Math.min(dpr, 2);
  }, [worldSize]);
}
