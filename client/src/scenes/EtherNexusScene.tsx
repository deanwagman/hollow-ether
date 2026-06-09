import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type { NexusVisualState } from '../game/useNexusVisualState';
import { TURN_MS } from '../theme/motion';
import { colors, fog } from '../theme/tokens';
import CameraRig from './nexus/CameraRig';
import { STAGE_FRAMING } from './nexus/stageFraming';
import LuminiaPresence from './nexus/LuminiaPresence';
import NexusPostProcessing from './nexus/NexusPostProcessing';
import ParticleField from './nexus/ParticleField';
import RippleFloor from './nexus/RippleFloor';

type EtherNexusSceneProps = {
  visualState: NexusVisualState;
};

function FogController({ density }: { density: number }) {
  const { scene } = useThree();
  const densityRef = useRef(density);

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-delta / (TURN_MS / 1000));
    densityRef.current += (density - densityRef.current) * t;
    const fogObj = scene.fog;
    if (fogObj && 'density' in fogObj) {
      fogObj.density = densityRef.current;
    }
  });

  return null;
}

function NexusWorld({ visualState }: EtherNexusSceneProps) {
  const { targetPreset, pulseToken, reducedMotion, liteMode } = visualState;
  const postEnabled = !reducedMotion && !liteMode;

  return (
    <>
      <color attach="background" args={[colors.background]} />
      <fogExp2 attach="fog" args={[fog.color, targetPreset.fogDensity]} />
      <FogController density={targetPreset.fogDensity} />
      <CameraRig />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 6]} intensity={0.7} color={colors.textPrimary} />
      <ParticleField preset={targetPreset} reducedMotion={reducedMotion || liteMode} />
      <RippleFloor
        preset={targetPreset}
        pulseToken={pulseToken}
        reducedMotion={reducedMotion}
      />
      <LuminiaPresence preset={targetPreset} />
      <NexusPostProcessing preset={targetPreset} enabled={postEnabled} />
    </>
  );
}

export default function EtherNexusScene({ visualState }: EtherNexusSceneProps) {
  return (
    <Canvas
      frameloop="always"
      camera={{
        position: [
          STAGE_FRAMING.camera.x,
          STAGE_FRAMING.camera.y,
          STAGE_FRAMING.camera.z,
        ],
        fov: 46,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', display: 'block', background: colors.background }}
    >
      <NexusWorld visualState={visualState} />
    </Canvas>
  );
}
