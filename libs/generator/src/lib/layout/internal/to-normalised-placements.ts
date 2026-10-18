import { chain } from '@mander/model';
import { map, min } from 'lodash-es';
import type { StructurePlacement } from './types/structure-placement';

export const toNormalisedPlacements = (
  placements: StructurePlacement[],
): StructurePlacement[] =>
  chain({
    topRow: min(map(placements, (placement) => placement.row)) ?? 0,
    leftColumn: min(map(placements, (placement) => placement.column)) ?? 0,
  })
    .thru(({ topRow, leftColumn }) =>
      map(placements, (placement): StructurePlacement => ({
        ...placement,
        row: placement.row - topRow,
        column: placement.column - leftColumn,
      })),
    )
    .value();
