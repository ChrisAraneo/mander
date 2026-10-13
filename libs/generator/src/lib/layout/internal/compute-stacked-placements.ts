import { type Sector, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { map, size } from 'lodash-es';
import type { Placement } from './placement';

export const computeStackedPlacements = (structures: Sector[]): Placement[] =>
  map(structures, (structure, index): Placement => ({
    structure,
    row: (size(structures) - 1 - index) * VERTICAL_BAND_HEIGHT,
    column: 0,
  }));
