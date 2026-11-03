import { isSand, type Level, TILE_SIZE } from '@mander/model';
import { floor, some } from 'lodash-es';
import { pipe } from 'remeda';
import { computeTileRange } from '../../collision/compute-tile-range';
import { SAND_PROBE_DEPTH } from '../consts';
import type { Walker } from '../types/walker';

export const isWalkingOnSand = (
  level: Level,
  { position, statuses }: Walker,
  width: number,
  height: number,
): boolean =>
  statuses.isGrounded &&
  pipe(floor((position.y + height + SAND_PROBE_DEPTH) / TILE_SIZE), (row) =>
    some(computeTileRange(position.x, width), (column) =>
      isSand(level, column, row),
    ),
  );
