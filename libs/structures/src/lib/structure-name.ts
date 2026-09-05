import { map, toPairs } from 'lodash-es';

import { HARD_LIBRARY, NORMAL_LIBRARY, VERTICAL_LIBRARY } from './library';
import type { Structure } from './structure';

const UNKNOWN_STRUCTURE = 'UNKNOWN';

const namesOf = (
  library: Readonly<Record<string, Structure>>,
): [Structure, string][] =>
  map(toPairs(library), ([name, structure]): [Structure, string] => [
    structure,
    name,
  ]);

const STRUCTURE_NAMES = new Map<Structure, string>([
  ...namesOf(NORMAL_LIBRARY),
  ...namesOf(HARD_LIBRARY),
  ...namesOf(VERTICAL_LIBRARY),
]);

export const getStructureName = (structure: Structure): string =>
  STRUCTURE_NAMES.get(structure) ?? UNKNOWN_STRUCTURE;
