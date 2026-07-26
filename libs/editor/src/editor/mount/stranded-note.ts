import type { Structure } from '@mander/generator';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';

import { plural } from '../utils/plural';
import { reachableFromEntry } from '../reachable-from-entry';

const strandedCount = (grid: Structure): number =>
  filter(reachableFromEntry(grid).reached, (isReached) => !isReached).length;

export const strandedNote = (grid: Structure): string =>
  match(strandedCount(grid))
    .with(0, () => '')
    .otherwise(
      (count) =>
        ` (${count} ${plural(count, 'platform')} unreachable from the entry.)`,
    );
