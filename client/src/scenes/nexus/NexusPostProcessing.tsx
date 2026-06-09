import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import type { VisualPreset } from '../../theme/presets';

type NexusPostProcessingProps = {
  preset: VisualPreset;
  enabled: boolean;
};

export default function NexusPostProcessing({
  preset,
  enabled,
}: NexusPostProcessingProps) {
  if (!enabled || preset.bloomIntensity <= 0) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={preset.bloomIntensity}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.82}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={preset.vignetteIntensity}
      />
    </EffectComposer>
  );
}
