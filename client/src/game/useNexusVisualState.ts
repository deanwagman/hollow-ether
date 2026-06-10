import type { GameState } from '@hollow-ether/shared';
import { useEffect, useRef, useState } from 'react';
import { LITE_BREAKPOINT_PX } from '../theme/motion';
import { resolveLitePreset, resolvePreset, type VisualPreset } from '../theme/presets';
import { useReducedMotionPreference } from '../scenes/useReducedMotionPreference';

export type NexusVisualState = {
  targetPreset: VisualPreset;
  pulseToken: number;
  reducedMotion: boolean;
  liteMode: boolean;
};

function useLiteMode(): boolean {
  const [liteMode, setLiteMode] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${LITE_BREAKPOINT_PX}px)`).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${LITE_BREAKPOINT_PX}px)`);
    const onChange = () => setLiteMode(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return liteMode;
}

export function useNexusVisualState(
  state: GameState | undefined,
  latestInteractState: GameState | undefined,
): NexusVisualState {
  const reducedMotion = useReducedMotionPreference();
  const liteMode = useLiteMode();
  const [pulseToken, setPulseToken] = useState(0);
  const prevScene = useRef(state?.currentScene);
  const prevInteractState = useRef(latestInteractState);

  useEffect(() => {
    if (!state) return;

    if (state.currentScene !== prevScene.current) {
      prevScene.current = state.currentScene;
      setPulseToken((t) => t + 1);
    }
  }, [state?.currentScene, state]);

  useEffect(() => {
    if (!latestInteractState || latestInteractState === prevInteractState.current) {
      return;
    }
    prevInteractState.current = latestInteractState;
    setPulseToken((t) => t + 1);
  }, [latestInteractState]);

  const basePreset = state
    ? resolvePreset(state.currentScene, state.flags)
    : resolvePreset('ch1_awakening', {
        met_luminia: false,
        luminia_trust: false,
        luminia_warned_door: false,
        act1_invitation_accepted: false,
      });

  const targetPreset =
    reducedMotion || liteMode ? resolveLitePreset(basePreset) : basePreset;

  return {
    targetPreset,
    pulseToken,
    reducedMotion,
    liteMode,
  };
}
