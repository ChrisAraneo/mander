import type { Sector } from '@mander/structures';
import { last, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computePlacementAfter } from './compute-placement-after';
import { toNormalisedPlacements } from './to-normalised-placements';
import type { StructurePlacement } from './types/structure-placement';

const { nullish } = P;

export const computeJoinedPlacements = (
  structures: Sector[],
): StructurePlacement[] =>
  toNormalisedPlacements(
    reduce(
      structures,
      (placed: StructurePlacement[], structure): StructurePlacement[] =>
        match(last(placed))
          .with(nullish, (): StructurePlacement[] => [
            { structure, row: 0, column: 0 },
          ])
          .otherwise((previous) => [
            ...placed,
            computePlacementAfter(previous, structure),
          ]),
      [],
    ),
  );
