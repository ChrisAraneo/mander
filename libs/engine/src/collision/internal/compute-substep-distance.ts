const SUBSTEP = 8;

export const computeSubstepDistance = (
  direction: number,
  remaining: number,
): number => direction * Math.min(Math.abs(remaining), SUBSTEP);
