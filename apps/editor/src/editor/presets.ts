import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
} from '@mander/generator';
import { map } from 'lodash-es';

import type { Preset } from './preset';

const labelled = (grids: readonly Structure[], difficulty: string): Preset[] =>
  map(grids, (grid, index) => ({
    label: `${difficulty} ${index + 1}`,
    grid,
  }));

export const PRESETS: Preset[] = [
  ...labelled(NORMAL_STRUCTURES, 'Normal'),
  ...labelled(HARD_STRUCTURES, 'Hard'),
];
