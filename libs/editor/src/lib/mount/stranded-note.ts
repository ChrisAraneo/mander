import type { ReachMap } from '@mander/engine';
import {
  isReachableSurface,
  type Structure,
  structureSurfaces,
} from '@mander/generator';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';

import { plural } from '../utils/plural';

const strandedCount = (grid: Structure, reach: ReachMap): number =>
  filter(
    structureSurfaces(grid),
    (surface) => !isReachableSurface(reach, surface),
  ).length;

export const strandedNote = (grid: Structure, reach: ReachMap): string =>
  match(strandedCount(grid, reach))
    .with(0, () => '')
    .otherwise(
      (count) =>
        ` (${count} ${plural(count, 'platform')} unreachable from the entry.)`,
    );
