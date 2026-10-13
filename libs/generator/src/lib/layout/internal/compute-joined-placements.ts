import type { Sector } from '@mander/structures';
import { last, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computePlacementAfter } from './compute-placement-after';
import type { Placement } from './placement';
import { toNormalisedPlacements } from './to-normalised-placements';

const { nullish } = P;

export const computeJoinedPlacements = (structures: Sector[]): Placement[] =>
  toNormalisedPlacements(
    reduce(
      structures,
      (placed: Placement[], structure): Placement[] =>
        match(last(placed))
          .with(nullish, (): Placement[] => [{ structure, row: 0, column: 0 }])
          .otherwise((previous) => [
            ...placed,
            computePlacementAfter(previous, structure),
          ]),
      [],
    ),
  );
