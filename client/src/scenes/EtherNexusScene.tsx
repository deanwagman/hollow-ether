import { Canvas } from '@react-three/fiber';
import { colors, fog } from '../theme/tokens';
import ParticleField from './ParticleField';
import { useReducedMotionPreference } from './useReducedMotionPreference';

function NexusWorld({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={[colors.background]} />
      <fogExp2 attach="fog" args={[fog.color, fog.density]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 6]} intensity={0.7} color={colors.textPrimary} />
      <ParticleField reducedMotion={reducedMotion} />
    </>
  );
}

export default function EtherNexusScene() {
  const reducedMotion = useReducedMotionPreference();

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', display: 'block', background: colors.background }}
    >
      <NexusWorld reducedMotion={reducedMotion} />
    </Canvas>
  );
}
