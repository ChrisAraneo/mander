import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Facing } from '../../types/facing';
import { ENEMY_WIDTH } from '../consts';

export const computeProbeColumn = (originX: number, facing: Facing): number =>
  floor(
    match(facing > 0)
      .with(true, () => originX + ENEMY_WIDTH + 1)
      .otherwise(() => originX - 1) / TILE_SIZE,
  );
