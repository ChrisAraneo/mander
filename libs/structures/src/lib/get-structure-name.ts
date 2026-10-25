import { toNamePairs } from './internal/to-name-pairs';
import { HARD_LIBRARY, NORMAL_LIBRARY, VERTICAL_LIBRARY } from './library';
import type { Sector } from './types/sector';

const UNKNOWN_STRUCTURE = 'UNKNOWN';

const STRUCTURE_NAMES: ReadonlyMap<Sector, string> = new Map<Sector, string>([
  ...toNamePairs(NORMAL_LIBRARY),
  ...toNamePairs(HARD_LIBRARY),
  ...toNamePairs(VERTICAL_LIBRARY),
]);

export const getStructureName = (structure: Sector): string =>
  STRUCTURE_NAMES.get(structure) ?? UNKNOWN_STRUCTURE;
