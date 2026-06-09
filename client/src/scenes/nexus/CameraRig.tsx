import { useFrame, useThree } from '@react-three/fiber';
import { STAGE_FRAMING } from './stageFraming';

export default function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(
      STAGE_FRAMING.camera.x,
      STAGE_FRAMING.camera.y,
      STAGE_FRAMING.camera.z,
    );
    camera.lookAt(STAGE_FRAMING.lookAt.x, STAGE_FRAMING.lookAt.y, STAGE_FRAMING.lookAt.z);
  });

  return null;
}
