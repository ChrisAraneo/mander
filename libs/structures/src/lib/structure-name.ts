import { map, toPairs } from 'lodash-es';
import { HARD_LIBRARY, NORMAL_LIBRARY, VERTICAL_LIBRARY } from './library';
import type { Sector } from './types/sector';

const UNKNOWN_STRUCTURE = 'UNKNOWN';

const toNamePairs = (
  library: Readonly<Record<string, Sector>>,
): [Sector, string][] =>
  map(toPairs(library), ([name, structure]): [Sector, string] => [
    structure,
    name,
  ]);

const STRUCTURE_NAMES: ReadonlyMap<Sector, string> = new Map<Sector, string>([
  ...toNamePairs(NORMAL_LIBRARY),
  ...toNamePairs(HARD_LIBRARY),
  ...toNamePairs(VERTICAL_LIBRARY),
]);

export const getStructureName = (structure: Sector): string =>
  STRUCTURE_NAMES.get(structure) ?? UNKNOWN_STRUCTURE;
