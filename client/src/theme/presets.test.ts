import { describe, expect, it } from 'vitest';
import { INITIAL_FLAGS } from '@hollow-ether/shared';
import { resolvePreset } from './presets';

describe('resolvePreset', () => {
  it('returns awakening preset with hidden figure', () => {
    const preset = resolvePreset('ch1_awakening', INITIAL_FLAGS);
    expect(preset.figureOpacity).toBe(0);
  });

  it('returns invitation preset with visible figure', () => {
    const preset = resolvePreset('ch1_invitation', INITIAL_FLAGS);
    expect(preset.figureOpacity).toBeGreaterThan(0);
  });

  it('applies complete override on act1_invitation_accepted', () => {
    const preset = resolvePreset('ch1_invitation_commit', {
      ...INITIAL_FLAGS,
      act1_invitation_accepted: true,
    });
    expect(preset.figureOpacity).toBe(0);
    expect(preset.bloomIntensity).toBeLessThan(0.3);
  });

  it('boosts particles when luminia_trust is set', () => {
    const without = resolvePreset('ch1_invitation', INITIAL_FLAGS);
    const withTrust = resolvePreset('ch1_invitation', {
      ...INITIAL_FLAGS,
      luminia_trust: true,
    });
    expect(withTrust.particleOpacity).toBeGreaterThan(without.particleOpacity);
  });
});
