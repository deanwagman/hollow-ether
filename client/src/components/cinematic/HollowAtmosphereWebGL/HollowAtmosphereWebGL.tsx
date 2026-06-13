import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import { useReducedMotionPreference } from '../../../game/useReducedMotionPreference';
import './HollowAtmosphereWebGL.css';

export type HollowAtmosphereWebGLScene = 'void';

export type HollowAtmosphereWebGLProps = {
  scene?: HollowAtmosphereWebGLScene;
  debugControls?: boolean;
  reducedMotion?: boolean;
  className?: string;
};

type VoidCubeSceneProps = {
  debugControls: boolean;
  shouldReduceMotion: boolean;
};

function VoidCubeScene({
  debugControls,
  shouldReduceMotion,
}: VoidCubeSceneProps) {
  const cubeRef = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (shouldReduceMotion) return;
    if (!cubeRef.current) return;

    cubeRef.current.rotation.x += delta * 0.35;
    cubeRef.current.rotation.y += delta * 0.5;
  });

  return (
    <>
      <color attach="background" args={['#000000']} />

      <ambientLight intensity={0.32} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />

      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>

      {debugControls && (
        <OrbitControls enableDamping dampingFactor={0.08} makeDefault />
      )}
    </>
  );
}

export function HollowAtmosphereWebGL({
  scene = 'void',
  debugControls = false,
  reducedMotion,
  className,
}: HollowAtmosphereWebGLProps) {
  const prefersReducedMotion = useReducedMotionPreference();
  const shouldReduceMotion = reducedMotion ?? prefersReducedMotion;

  return (
    <div
      className={['he-hollow-atmosphere-webgl', className]
        .filter(Boolean)
        .join(' ')}
      data-scene={scene}
      data-debug-controls={debugControls || undefined}
      data-reduced-motion={shouldReduceMotion || undefined}
    >
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        fallback={
          <div className="he-hollow-atmosphere-webgl__fallback">
            WebGL unavailable
          </div>
        }
      >
        <VoidCubeScene
          debugControls={debugControls}
          shouldReduceMotion={shouldReduceMotion}
        />
      </Canvas>
    </div>
  );
}
