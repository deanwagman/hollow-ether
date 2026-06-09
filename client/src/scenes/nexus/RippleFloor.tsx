import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BEAT_MS, TURN_MS } from '../../theme/motion';
import type { VisualPreset } from '../../theme/presets';
import { colors } from '../../theme/tokens';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uStrength;
  uniform vec3 uGridColor;
  uniform vec3 uHighlightColor;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered * vec2(1.0, 0.5));
    float grid = abs(sin(centered.x * 72.0)) * abs(sin(centered.y * 72.0));
    grid = smoothstep(0.96, 1.0, grid) * 0.12;

    float ripple = sin(dist * 24.0 - uTime * 1.6 - uPulse * 6.28) * 0.5 + 0.5;
    ripple *= exp(-dist * 2.8) * uStrength;
    ripple *= smoothstep(0.6, 0.0, dist);

    float pulseRing = exp(-abs(dist - fract(uPulse) * 0.4) * 14.0) * uStrength * 0.85;
    float idleRing = sin(dist * 18.0 - uTime * 0.9) * 0.5 + 0.5;
    idleRing *= exp(-dist * 2.2) * uStrength * 0.15;

    float edgeFade = smoothstep(0.85, 0.45, dist);
    vec3 color = uGridColor * (0.16 + grid);
    color += uHighlightColor * (ripple * 0.5 + pulseRing + idleRing);
    float alpha = (0.38 + ripple * 0.28 + pulseRing * 0.22 + idleRing * 0.1) * edgeFade;

    gl_FragColor = vec4(color, alpha);
  }
`;

type RippleFloorProps = {
  preset: VisualPreset;
  pulseToken: number;
  reducedMotion?: boolean;
};

export default function RippleFloor({
  preset,
  pulseToken,
  reducedMotion = false,
}: RippleFloorProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const strengthRef = useRef(preset.rippleStrength);
  const prevTokenRef = useRef(pulseToken);
  const animatingRef = useRef(false);
  const pulsePhaseRef = useRef(0);

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-delta / (TURN_MS / 1000));
    strengthRef.current += (preset.rippleStrength - strengthRef.current) * t;

    if (pulseToken !== prevTokenRef.current) {
      prevTokenRef.current = pulseToken;
      animatingRef.current = true;
      pulsePhaseRef.current = 0;
    }

    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uStrength.value = reducedMotion
      ? preset.rippleStrength * 0.25
      : strengthRef.current;

    if (animatingRef.current && !reducedMotion) {
      pulsePhaseRef.current += delta / (BEAT_MS / 1000);
      materialRef.current.uniforms.uPulse.value = pulsePhaseRef.current;
      if (pulsePhaseRef.current >= 1) {
        animatingRef.current = false;
        materialRef.current.uniforms.uPulse.value = 0;
      }
    }
  });

  const gridColor = new THREE.Color(colors.baseCharcoal);
  const highlightColor = new THREE.Color(colors.highlightCyan);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]}>
      <planeGeometry args={[22, 22, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uStrength: { value: preset.rippleStrength },
          uGridColor: { value: gridColor },
          uHighlightColor: { value: highlightColor },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
