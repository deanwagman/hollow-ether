import type { GameFlags, SceneId } from '@hollow-ether/shared';

export type VisualPreset = {
  particleOpacity: number;
  driftSpeed: number;
  driftAmount: number;
  fogDensity: number;
  bloomIntensity: number;
  vignetteIntensity: number;
  figureOpacity: number;
  rippleStrength: number;
};

const SCENE_PRESETS: Record<SceneId, VisualPreset> = {
  ch1_awakening: {
    particleOpacity: 0.32,
    driftSpeed: 0.12,
    driftAmount: 0.04,
    fogDensity: 0.028,
    bloomIntensity: 0.25,
    vignetteIntensity: 0.45,
    figureOpacity: 0,
    rippleStrength: 0.35,
  },
  ch1_invitation: {
    particleOpacity: 0.48,
    driftSpeed: 0.18,
    driftAmount: 0.065,
    fogDensity: 0.026,
    bloomIntensity: 0.52,
    vignetteIntensity: 0.58,
    figureOpacity: 0.6,
    rippleStrength: 0.74,
  },
  ch1_invitation_commit: {
    particleOpacity: 0.55,
    driftSpeed: 0.2,
    driftAmount: 0.075,
    fogDensity: 0.024,
    bloomIntensity: 0.62,
    vignetteIntensity: 0.6,
    figureOpacity: 0.85,
    rippleStrength: 0.97,
  },
};

const COMPLETE_PRESET: VisualPreset = {
  particleOpacity: 0.18,
  driftSpeed: 0.08,
  driftAmount: 0.02,
  fogDensity: 0.036,
  bloomIntensity: 0.12,
  vignetteIntensity: 0.58,
  figureOpacity: 0,
  rippleStrength: 0.14,
};

const TRUST_BOOST = {
  particleOpacity: 0.06,
  driftSpeed: 0.03,
};

const DOOR_FOG_BOOST = 0.006;

export function resolvePreset(sceneId: SceneId, flags: GameFlags): VisualPreset {
  if (flags.act1_invitation_accepted) {
    return { ...COMPLETE_PRESET };
  }

  const base = { ...SCENE_PRESETS[sceneId] };

  if (flags.luminia_trust) {
    base.particleOpacity += TRUST_BOOST.particleOpacity;
    base.driftSpeed += TRUST_BOOST.driftSpeed;
  }

  if (flags.luminia_warned_door) {
    base.fogDensity += DOOR_FOG_BOOST;
  }

  return base;
}

export function resolveLitePreset(preset: VisualPreset): VisualPreset {
  return {
    ...preset,
    bloomIntensity: 0,
    driftSpeed: preset.driftSpeed * 0.5,
    driftAmount: preset.driftAmount * 0.35,
    rippleStrength: preset.rippleStrength * 0.4,
  };
}
