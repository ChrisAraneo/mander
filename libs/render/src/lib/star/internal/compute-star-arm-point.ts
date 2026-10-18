import { type Point, chain } from '@mander/model';
import { match } from 'ts-pattern';
import { ARMS } from './consts';

const WAIST = 0.44;

const FIRST_ARM = -Math.PI / 2;

export const computeStarArmPoint = (
  centerX: number,
  centerY: number,
  radius: number,
  index: number,
): Point =>
  chain({
    angle: FIRST_ARM + (index * Math.PI) / ARMS,
    reach: match(index % 2)
      .with(0, () => radius)
      .otherwise(() => radius * WAIST),
  })
    .thru(({ angle, reach }): Point => ({
      x: centerX + Math.cos(angle) * reach,
      y: centerY + Math.sin(angle) * reach,
    }))
    .value();
