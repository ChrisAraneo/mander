import { chain } from '@mander/utils';
import { map, min } from 'lodash-es';
import type { Placement } from './placement';

export const normalisePlacements = (placements: Placement[]): Placement[] =>
  chain({
    topRow: min(map(placements, (placement) => placement.row)) ?? 0,
    leftColumn: min(map(placements, (placement) => placement.column)) ?? 0,
  })
    .thru(({ topRow, leftColumn }) =>
      map(placements, (placement): Placement => ({
        ...placement,
        row: placement.row - topRow,
        column: placement.column - leftColumn,
      })),
    )
    .value();
