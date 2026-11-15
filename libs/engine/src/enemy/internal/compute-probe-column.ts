import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import { FACING_RIGHT } from '../../facing/consts';
import type { Facing } from '../../facing/types/facing';
import { ENEMY_WIDTH } from '../consts';

const PROBE_REACH = 1;

export const computeProbeColumn = (originX: number, facing: Facing): number =>
  floor(
    match(facing)
      .with(FACING_RIGHT, () => originX + ENEMY_WIDTH + PROBE_REACH)
      .otherwise(() => originX - PROBE_REACH) / TILE_SIZE,
  );
