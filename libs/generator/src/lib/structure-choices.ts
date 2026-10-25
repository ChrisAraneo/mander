import {
  HARD_LIBRARY,
  NORMAL_LIBRARY,
  VERTICAL_LIBRARY,
} from '@mander/structures';
import { map, toPairs } from 'lodash-es';
import type { StructureChoice } from './types/structure-choice';

export const STRUCTURE_CHOICES: readonly StructureChoice[] = Object.freeze([
  ...map(toPairs(NORMAL_LIBRARY), ([name, structure]): StructureChoice =>
    Object.freeze({ name, category: 'NORMAL', structure }),
  ),
  ...map(toPairs(HARD_LIBRARY), ([name, structure]): StructureChoice =>
    Object.freeze({ name, category: 'HARD', structure }),
  ),
  ...map(toPairs(VERTICAL_LIBRARY), ([name, structure]): StructureChoice =>
    Object.freeze({ name, category: 'VERTICAL', structure }),
  ),
]);
