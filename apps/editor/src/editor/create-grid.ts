import { TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_END_ROW,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { includes, map, range, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { getHeight } from './get-height';
import type { Cell } from './types/cell';
import type { Pool } from './types/pool';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

const getStartingTile = ({ row, column }: Cell): number =>
  match({ row, column })
    .with({ row: VERTICAL_END_ROW, column: VERTICAL_MARKER_COLUMN }, () =>
      Number(STRUCTURE_END),
    )
    .with({ row: VERTICAL_START_ROW, column: VERTICAL_MARKER_COLUMN }, () =>
      Number(STRUCTURE_START),
    )
    .when(
      () =>
        row === VERTICAL_LAUNCH_ROW &&
        includes(VERTICAL_PLATFORM_COLUMNS, column),
      () => TILE_DIRT,
    )
    .otherwise(() => TILE_AIR);

const createGridRow = (pool: Pool, row: number): number[] =>
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

export const createGrid = (pool: Pool = 'normal'): number[][] =>
  map(range(getHeight(pool)), (row) => createGridRow(pool, row));
