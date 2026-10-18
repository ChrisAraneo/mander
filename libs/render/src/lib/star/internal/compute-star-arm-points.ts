import type { Point } from '@mander/utils';
import { map, range } from 'lodash-es';
import { computeStarArmPoint } from './compute-star-arm-point';
import { ARMS } from './consts';

export const computeStarArmPoints = (
  centerX: number,
  centerY: number,
  radius: number,
): Point[] =>
  map(range(ARMS * 2), (index) =>
    computeStarArmPoint(centerX, centerY, radius, index),
  );
