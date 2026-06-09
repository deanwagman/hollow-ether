/**
 * WebGL framing for the HTML narrative-stage band.
 * Camera lookAt must sit below orb Y so the orb renders inside the stage — not screen center.
 */
export const STAGE_FRAMING = {
  camera: { x: 0, y: 0.42, z: 4.7 },
  lookAt: { x: 0, y: -0.35, z: 0 },
  orb: [0, 0.78, -0.55] as [number, number, number],
};
