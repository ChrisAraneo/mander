import { type Point } from '@mander/model';

export const computeStarReachPoint = (
  centerX: number,
  centerY: number,
  angle: number,
  reach: number,
): Point => ({
  x: centerX + Math.cos(angle) * reach,
  y: centerY + Math.sin(angle) * reach,
});
