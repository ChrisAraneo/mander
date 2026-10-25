import { type Point } from '@mander/model';
import { match } from 'ts-pattern';
import { ARMS } from './consts';

const WAIST = 0.44;

const FIRST_ARM = -Math.PI / 2;

const computeStarReachPoint = (
  centerX: number,
  centerY: number,
  angle: number,
  reach: number,
): Point => ({
  x: centerX + Math.cos(angle) * reach,
  y: centerY + Math.sin(angle) * reach,
});

export const computeStarArmPoint = (
  centerX: number,
  centerY: number,
  radius: number,
  index: number,
): Point =>
  computeStarReachPoint(
    centerX,
    centerY,
    FIRST_ARM + (index * Math.PI) / ARMS,
    match(index % 2)
      .with(0, () => radius)
      .otherwise(() => radius * WAIST),
  );
