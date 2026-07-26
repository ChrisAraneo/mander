import {
  AIR,
  BLOCK,
  ENEMY,
  SECTOR_WIDTH,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { concat, map, some, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { isRows } from '../guards/is-rows';

const cellValue = (value: unknown): number =>
  match(value)
    .with(BLOCK, ENEMY, SPIKE, SPIKE_CEILING, (known) => known)
    .otherwise(() => AIR);

const airRows = (count: number): number[][] =>
  times(count, () => Array.from({ length: SECTOR_WIDTH }, (): number => AIR));

const fitHeight = (rows: number[][]): Structure =>
  match(rows.length)
    .with(STRUCTURE_HEIGHT, () => rows)
    .with(P.number.lt(STRUCTURE_HEIGHT), (height) =>
      concat(airRows(STRUCTURE_HEIGHT - height), rows),
    )
    .otherwise((height) => rows.slice(height - STRUCTURE_HEIGHT));

export const normalizeGrid = (data: unknown): Structure | null =>
  match(data)
    .with(P.when(isRows), (rows) =>
      match(map(rows, (row) => map(row, cellValue)))
        .with(
          P.when((mapped: number[][]) =>
            some(mapped, (row) => row.length !== SECTOR_WIDTH),
          ),
          () => null,
        )
        .otherwise(fitHeight),
    )
    .otherwise(() => null);
