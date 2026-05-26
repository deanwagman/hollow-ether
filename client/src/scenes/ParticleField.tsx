import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors, particles as particleConfig } from '../theme/tokens';
import { createParticlePhases, createParticlePositions } from './particleUtils';
import { useParticleSize } from './useParticleSize';

type ParticleFieldProps = {
  reducedMotion?: boolean;
};

export default function ParticleField({ reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = particleConfig.count;
  const screenSize = useParticleSize(particleConfig.size);

  const basePositions = useMemo(() => createParticlePositions(count), [count]);
  const phases = useMemo(() => createParticlePhases(count), [count]);

  const positionBuffer = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  const colorsBuffer = useMemo(() => {
    const buf = new Float32Array(count * 3);
    const accent = new THREE.Color(colors.accent);
    const muted = new THREE.Color(colors.accentMuted);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      tmp.copy(accent).lerp(muted, 0.35 + (i % 5) * 0.12);
      buf[i * 3] = tmp.r;
      buf[i * 3 + 1] = tmp.g;
      buf[i * 3 + 2] = tmp.b;
    }

    return buf;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime * particleConfig.driftSpeed;
    const amount = reducedMotion ? 0 : particleConfig.driftAmount;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] =
        basePositions[i3] +
        Math.sin(t * 0.9 + phases[i3]) * amount +
        Math.cos(t * 0.35 + phases[i3 + 1]) * amount * 0.35;
      arr[i3 + 1] =
        basePositions[i3 + 1] +
        Math.cos(t * 0.75 + phases[i3 + 1]) * amount * 0.85 +
        Math.sin(t * 0.5 + phases[i3 + 2]) * amount * 0.25;
      arr[i3 + 2] =
        basePositions[i3 + 2] + Math.sin(t * 0.55 + phases[i3 + 2]) * amount * 0.4;
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positionBuffer, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorsBuffer, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={screenSize}
        sizeAttenuation
        transparent
        opacity={particleConfig.opacity}
        depthWrite
        vertexColors
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
