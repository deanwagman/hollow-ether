import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TURN_MS } from '../../theme/motion';
import type { VisualPreset } from '../../theme/presets';
import { STAGE_FRAMING } from './stageFraming';

const ORB_POSITION = STAGE_FRAMING.orb;
const CORE_RADIUS = 0.2;
const HALO_RADIUS = 0.34;

const coreVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const coreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(vViewDir, vNormal), 0.0), 2.2);
    float swirl = sin(vNormal.x * 9.0 + uTime * 1.1) * sin(vNormal.y * 7.0 - uTime * 0.85);
    float pulse = sin(uTime * 0.9) * 0.5 + 0.5;
    vec3 violet = vec3(0.55, 0.46, 0.78);
    vec3 plasma = vec3(0.32, 0.78, 0.82);
    vec3 color = mix(violet, plasma, fresnel * 0.55 + swirl * 0.12 + pulse * 0.08);
    float alpha = uOpacity * (0.5 + fresnel * 0.42 + pulse * 0.06);
    gl_FragColor = vec4(color, alpha);
  }
`;

const haloVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const haloFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(vViewDir, vNormal), 0.0), 1.4);
    float pulse = sin(uTime * 0.7 + 1.2) * 0.5 + 0.5;
    vec3 glow = vec3(0.48, 0.42, 0.72);
    float alpha = uOpacity * fresnel * (0.22 + pulse * 0.08);
    gl_FragColor = vec4(glow, alpha);
  }
`;

type LuminiaPresenceProps = {
  preset: VisualPreset;
};

export default function LuminiaPresence({ preset }: LuminiaPresenceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);
  const haloMatRef = useRef<THREE.ShaderMaterial>(null);
  const opacityRef = useRef(preset.figureOpacity);

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-delta / (TURN_MS / 1000));
    opacityRef.current += (preset.figureOpacity - opacityRef.current) * t;

    const opacity = opacityRef.current;
    const time = state.clock.elapsedTime;

    if (coreMatRef.current) {
      coreMatRef.current.uniforms.uTime.value = time;
      coreMatRef.current.uniforms.uOpacity.value = opacity;
    }
    if (haloMatRef.current) {
      haloMatRef.current.uniforms.uTime.value = time;
      haloMatRef.current.uniforms.uOpacity.value = opacity;
    }

    if (groupRef.current && opacity > 0.01) {
      const breath = 1 + Math.sin(time * 0.6) * 0.04;
      groupRef.current.scale.setScalar(breath);
    }
  });

  if (preset.figureOpacity <= 0.001 && opacityRef.current <= 0.001) {
    return null;
  }

  return (
    <group ref={groupRef} position={ORB_POSITION}>
      <pointLight
        color="#8a7ec8"
        intensity={preset.figureOpacity * 1.8}
        distance={4}
        decay={2}
      />
      <mesh>
        <sphereGeometry args={[CORE_RADIUS, 48, 48]} />
        <shaderMaterial
          ref={coreMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: preset.figureOpacity },
          }}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[HALO_RADIUS, 32, 32]} />
        <shaderMaterial
          ref={haloMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: preset.figureOpacity },
          }}
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
        />
      </mesh>
    </group>
  );
}
