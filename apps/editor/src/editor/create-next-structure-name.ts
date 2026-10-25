import { filter, map, max, nth, padStart, split } from 'lodash-es';
import { pipe } from 'remeda';
import { STRUCTURE_PREFIXES } from './consts';
import type { Pool } from './types/pool';
import type { StructureEntry } from './types/structure-entry';

const NAME_DIGITS = 3;

const parseNumber = (name: string): number =>
  Number(nth(split(name, '_'), 1) ?? 0);

const computeHighestNumber = (entries: StructureEntry[], pool: Pool): number =>
  max(
    map(
      filter(entries, (entry) => entry.pool === pool),
      (entry) => parseNumber(entry.name),
    ),
  ) ?? 0;

export const createNextStructureName = (
  entries: StructureEntry[],
  pool: Pool,
): string =>
  pipe(
    computeHighestNumber(entries, pool),
    (highest) => padStart(String(highest + 1), NAME_DIGITS, '0'),
    (digits) => `${STRUCTURE_PREFIXES[pool]}_${digits}`,
  );
