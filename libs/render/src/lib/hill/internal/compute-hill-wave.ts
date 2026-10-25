const HILL_RIPPLE_FREQUENCY = 2.3;

const HILL_RIPPLE_WEIGHT = 0.4;

export const computeHillWave = (phase: number): number =>
  Math.sin(phase) +
  Math.sin(phase * HILL_RIPPLE_FREQUENCY) * HILL_RIPPLE_WEIGHT;
