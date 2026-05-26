import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

function Cube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c9a227" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function HelloCube() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={['#0a0a12']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#6b8cff" />
      <Cube />
    </Canvas>
  );
}
