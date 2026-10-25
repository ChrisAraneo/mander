import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_HEIGHT, STRUCTURE_WIDTH } from '@mander/structures';
import { map, range, times } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Pool } from '../types/pool';
import { getStartingTile } from './get-starting-tile';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const createGridRow = (pool: Pool, row: number): number[] =>
  match(pool)
    .with('vertical', () =>
      map(range(STRUCTURE_WIDTH), (column) => getStartingTile({ row, column })),
    )
    .otherwise(() =>
      times(STRUCTURE_WIDTH, () =>
        match(row)
          .with(GROUND_ROW, () => TILE_DIRT)
          .otherwise(() => TILE_AIR),
      ),
    );
