import type { Enemy } from '@mander/model';
import { map, find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computeInterpolatedPoint } from './compute-interpolated-point';
import { isSameEnemy } from './is-same-enemy';

const { nonNullable } = P;

export const patchInterpolatedEnemyPositions = (
  previous: Enemy[],
  current: Enemy[],
  alpha: number,
): Enemy[] =>
  map(current, (enemy) =>
    match(find(previous, (before) => isSameEnemy(before, enemy)))
      .with(nonNullable, (before): Enemy => ({
        ...enemy,
        position: computeInterpolatedPoint(
          before.position,
          enemy.position,
          alpha,
        ),
      }))
      .otherwise(() => enemy),
  );
