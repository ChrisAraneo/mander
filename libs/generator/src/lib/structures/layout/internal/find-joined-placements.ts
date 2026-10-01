import type { Sector } from '@mander/structures';
import { last, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { getPlacementAfter } from './get-placement-after';
import { normalisePlacements } from './normalise-placements';
import type { Placement } from './placement';

const { nullish } = P;

export const findJoinedPlacements = (structures: Sector[]): Placement[] =>
  normalisePlacements(
    reduce(
      structures,
      (placed: Placement[], structure): Placement[] =>
        match(last(placed))
          .with(nullish, (): Placement[] => [{ structure, row: 0, column: 0 }])
          .otherwise((previous) => [
            ...placed,
            getPlacementAfter(previous, structure),
          ]),
      [],
    ),
  );
