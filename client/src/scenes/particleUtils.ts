import { particles as particleConfig } from '../theme/tokens';

const CAMERA_Z = 4;
const MIN_DIST = 4;
const MAX_DIST = 8.5;
/** Extend past FOV so stars reach screen edges */
const FOV_MARGIN = 1.38;
const FOV_DEG = 50;

const randFactory = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
};

const halfTan = Math.tan((FOV_DEG * Math.PI) / 180 / 2) * FOV_MARGIN;

/**
 * Sample stars inside the camera frustum (plus margin) so edges aren't empty.
 */
export function createParticlePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const rand = randFactory(42);

  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const v = rand() * 2 - 1;
    const depth = MIN_DIST + rand() * (MAX_DIST - MIN_DIST);

    const x = u * halfTan * depth;
    const y = v * halfTan * depth;
    const z = CAMERA_Z - depth;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

/** Per-particle phase for non-synced drift */
export function createParticlePhases(count: number): Float32Array {
  const phases = new Float32Array(count * 3);
  const rand = randFactory(99);

  for (let i = 0; i < count; i++) {
    phases[i * 3] = rand() * Math.PI * 2;
    phases[i * 3 + 1] = rand() * Math.PI * 2;
    phases[i * 3 + 2] = rand() * Math.PI * 2;
  }

  return phases;
}

export { particleConfig };
