import { filter, map, max } from 'lodash-es';
import type { Pool } from '../types/pool';
import type { StructureEntry } from '../types/structure-entry';
import { parseStructureNumber } from './parse-structure-number';

export const computeHighestNumber = (
  entries: StructureEntry[],
  pool: Pool,
): number =>
  max(
    map(
      filter(entries, (entry) => entry.pool === pool),
      (entry) => parseStructureNumber(entry.name),
    ),
  ) ?? 0;
