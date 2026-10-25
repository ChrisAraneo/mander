import { map, min } from 'lodash-es';
import { pipe } from 'remeda';
import type { StructurePlacement } from './types/structure-placement';

export const toNormalisedPlacements = (
  placements: StructurePlacement[],
): StructurePlacement[] =>
  pipe(
    placements,
    (found) => ({
      found,
      topRow: min(map(found, (placement) => placement.row)) ?? 0,
      leftColumn: min(map(found, (placement) => placement.column)) ?? 0,
    }),
    ({ found, topRow, leftColumn }) =>
      map(found, (placement): StructurePlacement => ({
        ...placement,
        row: placement.row - topRow,
        column: placement.column - leftColumn,
      })),
  );
