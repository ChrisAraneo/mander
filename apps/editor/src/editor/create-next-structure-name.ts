import { padStart } from 'lodash-es';
import { pipe } from 'remeda';
import { STRUCTURE_PREFIXES } from './consts';
import { computeHighestNumber } from './internal/compute-highest-number';
import type { Pool } from './types/pool';
import type { StructureEntry } from './types/structure-entry';

const NAME_DIGITS = 3;

export const createNextStructureName = (
  entries: StructureEntry[],
  pool: Pool,
): string =>
  pipe(
    computeHighestNumber(entries, pool),
    (highest) => padStart(String(highest + 1), NAME_DIGITS, '0'),
    (digits) => `${STRUCTURE_PREFIXES[pool]}_${digits}`,
  );
