import { HARD_STRUCTURES, NORMAL_STRUCTURES } from '@mander/generator';
import { concat, map } from 'lodash-es';

import type { StructureExample } from '../types/structure-example';

export const createExamples = (): StructureExample[] =>
  concat(
    map(NORMAL_STRUCTURES, (structure, index) => ({
      label: `Normal ${index + 1}`,
      grid: structure,
    })),
    map(HARD_STRUCTURES, (structure, index) => ({
      label: `Hard ${index + 1}`,
      grid: structure,
    })),
  );
