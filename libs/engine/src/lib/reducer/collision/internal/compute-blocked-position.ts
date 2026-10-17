import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPSILON } from '../consts';

export const computeBlockedPosition = (
  nextPosition: number,
  direction: number,
  size: number,
): number =>
  match(direction > 0)
    .with(
      true,
      () =>
        floor((nextPosition + size - EPSILON) / TILE_SIZE) * TILE_SIZE - size,
    )
    .otherwise(() => (floor(nextPosition / TILE_SIZE) + 1) * TILE_SIZE);
