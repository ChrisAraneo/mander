import {
  AIR,
  BLOCK,
  ENEMY,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { concat, isArray, map, some, times } from 'lodash-es';
import { match, P } from 'ts-pattern';

const isRows = (value: unknown): value is unknown[][] =>
  isArray(value) && !some(value, (row) => !isArray(row));

const cellValue = (value: unknown): number =>
  match(value)
    .with(BLOCK, ENEMY, (known) => known)
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

export const normalize = (data: unknown): Structure | null =>
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
