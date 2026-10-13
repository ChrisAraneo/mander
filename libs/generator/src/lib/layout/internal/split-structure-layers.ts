import { getBack, getFront } from '@mander/structures';
import { map } from 'lodash-es';
import type { createStructureGrid } from './create-structure-grid';
import type { LayerPlacement } from './layer-placement';
import { sliceLayer } from './slice-layer';

export const splitStructureLayers = ({
  levelType,
  placements,
  tiles,
}: ReturnType<typeof createStructureGrid>) => ({
  levelType,
  tiles,
  fronts: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: sliceLayer(getFront(structure), levelType),
    row,
    column,
  })),
  backs: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: sliceLayer(getBack(structure), levelType),
    row,
    column,
  })),
});
