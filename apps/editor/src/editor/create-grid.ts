import { type Layers, TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  VERTICAL_HEIGHT,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_END_ROW,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { includes, map, range, times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Pool } from './structure-entry';

interface Cell {
  row: number;
  column: number;
}

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const heightOf = (pool: Pool): number =>
  match(pool)
    .with('vertical', () => VERTICAL_HEIGHT)
    .otherwise(() => STRUCTURE_HEIGHT);

// a vertical sector is born with the blocks the climb is joined by
const seeded = ({ row, column }: Cell): number =>
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

const laidAcross = (pool: Pool, row: number): number[] =>
  match(pool)
    .with('vertical', () =>
      map(range(STRUCTURE_WIDTH), (column) => seeded({ row, column })),
    )
    .otherwise(() =>
      times(STRUCTURE_WIDTH, () =>
        match(row)
          .with(GROUND_ROW, () => TILE_DIRT)
          .otherwise(() => TILE_AIR),
      ),
    );

export const emptyGrid = (pool: Pool = 'normal'): number[][] =>
  map(range(heightOf(pool)), () => times(STRUCTURE_WIDTH, () => TILE_AIR));

export const createGrid = (pool: Pool = 'normal'): number[][] =>
  map(range(heightOf(pool)), (row) => laidAcross(pool, row));

// both layers are held at full size while the sector is painted; the empty one
// is trimmed away when it is written out
export const createSketch = (pool: Pool = 'normal'): Layers => ({
  tiles: createGrid(pool),
  backTiles: emptyGrid(pool),
});
