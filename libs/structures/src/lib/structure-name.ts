import { map, toPairs } from 'lodash-es';

import { HARD_LIBRARY, NORMAL_LIBRARY, VERTICAL_LIBRARY } from './library';
import type { Sector } from './structure';

const UNKNOWN_STRUCTURE = 'UNKNOWN';

const listNamePairs = (
  library: Readonly<Record<string, Sector>>,
): [Sector, string][] =>
  map(toPairs(library), ([name, structure]): [Sector, string] => [
    structure,
    name,
  ]);

const STRUCTURE_NAMES = new Map<Sector, string>([
  ...listNamePairs(NORMAL_LIBRARY),
  ...listNamePairs(HARD_LIBRARY),
  ...listNamePairs(VERTICAL_LIBRARY),
]);

export const getStructureName = (structure: Sector): string =>
  STRUCTURE_NAMES.get(structure) ?? UNKNOWN_STRUCTURE;
