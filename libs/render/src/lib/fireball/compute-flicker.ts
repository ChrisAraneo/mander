const FLICKER_SPEED = 14;

const FLICKER_DEPTH = 0.12;

export const computeFlicker = (angle: number, time: number): number =>
  1 + Math.sin(time * FLICKER_SPEED + angle) * FLICKER_DEPTH;
