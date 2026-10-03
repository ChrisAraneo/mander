import { getBack, getFront } from '@mander/structures';
import { map } from 'lodash-es';
import type { createStructureGrid } from './create-structure-grid';
import { cutLayer } from './cut-layer';
import type { LayerPlacement } from './layer-placement';

export const splitStructureLayers = ({
  levelType,
  placements,
  tiles,
}: ReturnType<typeof createStructureGrid>) => ({
  levelType,
  tiles,
  fronts: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: cutLayer(getFront(structure), levelType),
    row,
    column,
  })),
  backs: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: cutLayer(getBack(structure), levelType),
    row,
    column,
  })),
});
