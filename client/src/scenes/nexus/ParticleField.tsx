import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TURN_MS } from '../../theme/motion';
import type { VisualPreset } from '../../theme/presets';
import { colors } from '../../theme/tokens';
import { createParticlePhases, createParticlePositions } from '../particleUtils';
import { useParticleSize } from '../useParticleSize';

type ParticleFieldProps = {
  preset: VisualPreset;
  reducedMotion?: boolean;
};

export default function ParticleField({
  preset,
  reducedMotion = false,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 280;
  const baseSize = 0.024;
  const screenSize = useParticleSize(baseSize);

  const basePositions = useMemo(() => createParticlePositions(count), [count]);
  const phases = useMemo(() => createParticlePhases(count), [count]);

  const positionBuffer = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  const colorsBuffer = useMemo(() => {
    const buf = new Float32Array(count * 3);
    const accent = new THREE.Color(colors.accentEther);
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

  const opacityRef = useRef(preset.particleOpacity);
  const driftSpeedRef = useRef(preset.driftSpeed);
  const driftAmountRef = useRef(preset.driftAmount);

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-delta / (TURN_MS / 1000));
    opacityRef.current += (preset.particleOpacity - opacityRef.current) * t;
    driftSpeedRef.current += (preset.driftSpeed - driftSpeedRef.current) * t;
    driftAmountRef.current += (preset.driftAmount - driftAmountRef.current) * t;

    if (!pointsRef.current) return;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = opacityRef.current;

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const clockT = state.clock.elapsedTime * driftSpeedRef.current;
    const amount = reducedMotion ? 0 : driftAmountRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] =
        basePositions[i3] +
        Math.sin(clockT * 0.9 + phases[i3]) * amount +
        Math.cos(clockT * 0.35 + phases[i3 + 1]) * amount * 0.35;
      arr[i3 + 1] =
        basePositions[i3 + 1] +
        Math.cos(clockT * 0.75 + phases[i3 + 1]) * amount * 0.85 +
        Math.sin(clockT * 0.5 + phases[i3 + 2]) * amount * 0.25;
      arr[i3 + 2] =
        basePositions[i3 + 2] + Math.sin(clockT * 0.55 + phases[i3 + 2]) * amount * 0.4;
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
        opacity={preset.particleOpacity}
        depthWrite
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
