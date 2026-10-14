import { type Sector, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { map, size } from 'lodash-es';
import type { StructurePlacement } from './types/structure-placement';

export const computeStackedPlacements = (
  structures: Sector[],
): StructurePlacement[] =>
  map(structures, (structure, index): StructurePlacement => ({
    structure,
    row: (size(structures) - 1 - index) * VERTICAL_BAND_HEIGHT,
    column: 0,
  }));
