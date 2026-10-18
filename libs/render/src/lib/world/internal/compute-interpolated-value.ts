export const computeInterpolatedValue = (
  from: number,
  to: number,
  alpha: number,
): number => from + (to - from) * alpha;
