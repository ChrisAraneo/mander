import { map, toPairs } from 'lodash-es';
import type { Sector } from '../types/sector';

export const toNamePairs = (
  library: Readonly<Record<string, Sector>>,
): [Sector, string][] =>
  map(toPairs(library), ([name, structure]): [Sector, string] => [
    structure,
    name,
  ]);
